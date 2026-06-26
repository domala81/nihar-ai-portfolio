"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Languages,
  Database,
  Server,
  Boxes,
  Target,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { projects, type ProjectEntry } from "@/data";
import { registerAnchor } from "../thread/anchorStore";

/**
 * Section 3 — Projects ("Output layer").
 *
 * The neural network's outputs, made browsable. The project nodes orbit a cobalt
 * core on the left; a spotlight auto-cycles which one shows in a fixed detail panel
 * on the right. Move the pointer near the orbit and the nearest node takes over and
 * holds while you read (and while you're on the panel); move away and autoplay
 * resumes. Reads from data/projects.ts — one data source for the pipeline, this
 * section, and the timeline.
 *
 * Below lg, and under prefers-reduced-motion, the orbit is replaced by a calm,
 * fully-readable stack of scannable case-study cards (no rotation, no autoplay).
 */

// Distinct lucide glyph per project (the canvas uses one "project" glyph; here each
// output gets its own mark).
const PROJECT_GLYPH: Record<string, LucideIcon> = {
  nlp: Languages,
  proj2: Database,
  proj3: Server,
};

const ORBIT_RADIUS = 168; // px — node ring radius on the lg stage
const SPIN_SECONDS = 46;
const AUTO_MS = 4200;
const NEAR_PX = 96; // pointer proximity that hands control to a node

export default function OrbitalProjects() {
  const reduce = useReducedMotion();

  return (
    <section
      id="projects"
      aria-label="Selected projects"
      className="border-t border-border-soft px-6 py-24 sm:px-10"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          Output layer
        </p>
        <h2
          className="mt-3 text-balance font-sans font-semibold tracking-tightish text-ink"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
        >
          What the network shipped
        </h2>
        <p className="mt-3 max-w-measure text-pretty leading-relaxed text-ink-muted">
          What the stack above produced: the problem, the approach, and the impact
          metric that mattered.
        </p>

        {reduce ? (
          // Reduced motion → calm static cards on every size.
          <StaticProjects className="mt-12" />
        ) : (
          <>
            <OrbitView />
            <StaticProjects className="mt-10 lg:hidden" />
          </>
        )}
      </div>
    </section>
  );
}

function OrbitView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nearOrbit, setNearOrbit] = useState(false);
  const [overPanel, setOverPanel] = useState(false);

  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  // Register the lime core as the projects "me" anchor for the page thread.
  useEffect(
    () => (coreRef.current ? registerAnchor("projects", coreRef.current) : undefined),
    [],
  );

  const engaged = nearOrbit || overPanel;

  const go = (delta: number) =>
    setActiveIndex((i) => (i + delta + projects.length) % projects.length);

  // Autoplay: advance the spotlight while the user isn't engaged.
  useEffect(() => {
    if (engaged || projects.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % projects.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [engaged]);

  // Pointer proximity: nearest node within NEAR_PX takes the spotlight and holds.
  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      let best = -1;
      let bestDist = Infinity;
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(
          clientX - (r.left + r.width / 2),
          clientY - (r.top + r.height / 2),
        );
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best >= 0 && bestDist <= NEAR_PX) {
        setActiveIndex(best);
        setNearOrbit(true);
      } else {
        setNearOrbit(false);
      }
    });
  }, []);

  const spin = (reverse = false) =>
    ({
      animationName: "spin",
      animationDuration: `${SPIN_SECONDS}s`,
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      animationDirection: reverse ? "reverse" : "normal",
      animationPlayState: engaged ? "paused" : "running",
    }) as const;

  return (
    <div className="mt-12 hidden grid-cols-[minmax(0,440px)_1fr] items-center gap-x-10 lg:grid">
      {/* Left: orbit stage */}
      <div
        onPointerMove={handleMove}
        onPointerLeave={() => setNearOrbit(false)}
        className="relative mx-auto h-[440px] w-[440px]"
      >
        {/* orbit path */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hairline"
          style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
        />
        {/* center — the lime "me" / output node, same big lime core as the network's result node */}
        <div
          ref={coreRef}
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="relative flex h-16 w-16 items-center justify-center">
            {/* soft outer glow + a gentle pulse ring (alive) */}
            <span className="absolute -inset-3 rounded-full bg-live/20 blur-lg" />
            <span className="absolute inset-0 animate-ping rounded-full border border-live/30" />
            {/* the lime core token */}
            <span
              className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-live/60 bg-live/10 text-live"
              style={{ boxShadow: "0 0 24px 2px rgba(204,255,0,0.3)" }}
            >
              <Target className="h-6 w-6" strokeWidth={1.75} />
            </span>
          </span>
        </div>

        {/* spinning ring of nodes */}
        <div className="absolute inset-0 animate-spin" style={spin()}>
          {projects.map((p, i) => {
            // Position by trig + center on the point → nodes sit exactly on the orbit
            // circle (radius = ORBIT_RADIUS) and rotation about the stage center keeps
            // them there. No rotate()/origin tricks that drifted them off the line.
            const rad = ((-90 + i * (360 / projects.length)) * Math.PI) / 180;
            const x = ORBIT_RADIUS * Math.cos(rad);
            const y = ORBIT_RADIUS * Math.sin(rad);
            const isActive = i === activeIndex;
            const Glyph = PROJECT_GLYPH[p.id] ?? Boxes;
            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${x.toFixed(1)}px)`,
                  top: `calc(50% + ${y.toFixed(1)}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* counter-spin keeps the node upright while it orbits (pivots in place) */}
                <div className="animate-spin" style={spin(true)}>
                  <button
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    type="button"
                    aria-label={`${p.title} — view details`}
                    aria-pressed={isActive}
                    onFocus={() => {
                      setActiveIndex(i);
                      setNearOrbit(true);
                    }}
                    onBlur={() => setNearOrbit(false)}
                    onClick={() => {
                      setActiveIndex(i);
                      setNearOrbit(true);
                    }}
                    className="group/node relative block rounded-full outline-none"
                  >
                    {/* active glow — cobalt, in sync with the network + experience nodes */}
                    <span
                      aria-hidden
                      className={`absolute -inset-2 rounded-full bg-infra/25 blur-md transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 bg-bg transition-all duration-300 ease-out-quint group-focus-visible/node:ring-2 group-focus-visible/node:ring-infra group-focus-visible/node:ring-offset-2 group-focus-visible/node:ring-offset-bg ${
                        isActive
                          ? "scale-110 border-infra text-infra"
                          : "border-infra/55 text-infra group-hover/node:border-infra"
                      }`}
                    >
                      <Glyph className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span
                      className={`pointer-events-none absolute left-1/2 top-[60px] w-32 -translate-x-1/2 text-center font-mono text-[11px] leading-tight transition-colors duration-300 ${
                        isActive ? "text-ink" : "text-ink-muted"
                      }`}
                    >
                      {p.title}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: fixed detail panel */}
      <div
        onMouseEnter={() => setOverPanel(true)}
        onMouseLeave={() => setOverPanel(false)}
      >
        {/* stable wrapper carries the hover pop + diagonal shine (same as the experience
            cards); the crossfade child only animates opacity/y, so no transform conflict */}
        <div className="group/panel relative overflow-hidden rounded-lg border border-border-soft bg-surface p-6 transition-[transform,border-color,background-color] duration-200 ease-out-quint will-change-transform hover:-translate-y-0.5 hover:scale-[1.015] hover:border-infra/45 hover:bg-[#0d121c] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(125deg,rgba(226,235,255,0.07)_0%,rgba(226,235,255,0.025)_26%,transparent_52%)] opacity-0 transition-opacity duration-300 ease-out-quint group-hover/panel:opacity-100 motion-reduce:transition-none"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={projects[activeIndex].id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <ProjectBody p={projects[activeIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* spotlight position + prev/next (near-invisible, pop on hover) */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-soft text-ink-muted opacity-20 transition-all duration-200 ease-out-quint hover:scale-110 hover:border-infra hover:text-ink hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-infra"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>

          <div className="flex items-center gap-2" aria-hidden>
            {projects.map((p, i) => (
              <span
                key={p.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-6 bg-infra" : "w-2 bg-hairline"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-soft text-ink-muted opacity-20 transition-all duration-200 ease-out-quint hover:scale-110 hover:border-infra hover:text-ink hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-infra"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

function StaticProjects({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${className}`}>
      {projects.map((p) => (
        <div
          key={p.id}
          className="rounded-lg border border-border-soft bg-surface p-5 sm:p-6"
        >
          <ProjectBody p={p} />
        </div>
      ))}
    </div>
  );
}

/** Shared project content: header + Problem / Approach / Impact / stack / actions. */
function ProjectBody({ p }: { p: ProjectEntry }) {
  const Glyph = PROJECT_GLYPH[p.id] ?? Boxes;
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-soft bg-bg text-infra">
            <Glyph className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <h3 className="font-sans text-lg font-semibold tracking-tightish text-ink">
            {p.title}
          </h3>
        </div>
        {p.date && (
          <span className="shrink-0 font-mono text-xs text-ink-muted">
            {p.date}
          </span>
        )}
      </div>

      {p.problem && <Field label="Problem">{p.problem}</Field>}
      {p.description && <Field label="Approach">{p.description}</Field>}

      {p.metric && (
        <div className="mt-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Impact
          </p>
          <p className="mt-1 font-mono text-sm text-live">{p.metric}</p>
        </div>
      )}

      {p.tech && p.tech.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tech.map((c) => (
            <li
              key={c}
              className="rounded border border-border-soft bg-bg px-2 py-0.5 font-mono text-[11px] text-ink-muted"
            >
              {c}
            </li>
          ))}
        </ul>
      )}

      {p.links && p.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {p.links.map((l) => {
            const primary = l.label.toLowerCase() === "demo";
            return (
              <a
                key={l.label}
                href={l.href}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-colors duration-200 ease-out-quint ${
                  primary
                    ? "bg-ink text-bg hover:bg-live"
                    : "border border-border-soft bg-bg text-ink hover:border-infra"
                }`}
              >
                {l.label === "Code" ? (
                  <Code2 className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                )}
                {l.label}
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 first:mt-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="mt-1 max-w-measure text-pretty text-sm leading-relaxed text-ink">
        {children}
      </p>
    </div>
  );
}
