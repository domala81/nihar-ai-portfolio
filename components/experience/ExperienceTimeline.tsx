"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";
import {
  Briefcase,
  Backpack,
  GraduationCap,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import { experience, type ExperienceEntry } from "@/data";
import { ICONS } from "../pipeline/iconData";
import { registerAnchor } from "../thread/anchorStore";

/**
 * Section 4 — Professional Experience ("Signal Trace").
 *
 * The neural network's synapse, continued: a thin cobalt spine runs down the left
 * edge; each role is a node that lights as the scroll-drawn trace reaches it, with
 * the detail living in a lifted card that pops on hover. Single source of truth —
 * reads straight off the canvas Deployment layer (pipeline Layer 4), so the timeline
 * and the network can never drift apart.
 *
 * Each spine node is a small role-icon token (echoing the canvas NodeToken), the year
 * sits in an outside-left gutter on desktop, and cards zoom a touch with a node glow on
 * hover. Detail: brand-logo tech chips and a faint per-role glyph watermark.
 * Bullets stagger in as each card enters view.
 * Everything degrades to a calm, fully-readable static layout under
 * prefers-reduced-motion and stacks cleanly on small screens.
 */

// Rail center — the spine and the nodes sit here. On sm the rail shifts right to
// make room for the outside-left year gutter.
const RAIL = "left-[18px] sm:left-[84px]";

// Connection label → simple-icons slug (brand glyphs live in iconData.ts).
const CONNECTION_SLUG: Record<string, string> = {
  "Apache Spark": "apachespark",
  "Apache Airflow": "apacheairflow",
  PyTorch: "pytorch",
  Python: "python",
  PostgreSQL: "postgresql",
  Snowflake: "snowflake",
};

// Large, faint watermark glyph per role — gives each card its own identity.
const ROLE_GLYPH: Record<string, LucideIcon> = {
  "exp-de": Briefcase, // job — same glyph the network gives experience nodes (NodeBadge)
  "exp-intern": Backpack, // internship — distinct from the job briefcase
  "exp-ms": GraduationCap, // schooling
};

export default function ExperienceTimeline() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const nowRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  // Register the lime "now" head (dock) + the live trace tip (track) for the page thread.
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    if (nowRef.current) cleanups.push(registerAnchor("experience", nowRef.current));
    if (tipRef.current)
      cleanups.push(
        registerAnchor("experience-tip", tipRef.current, { dock: false, track: true }),
      );
    return () => cleanups.forEach((c) => c());
  }, []);

  // Scroll progress through the list draws the cobalt trace down the spine.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const bulletVariants: Variants = {
    hidden: { y: 8 },
    show: { y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="experience"
      aria-label="Professional experience timeline"
      className="border-t border-border-soft px-6 py-24 sm:px-10"
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* Section opener — same machine-voice label grammar as the other sections */}
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          Deployment history
        </p>
        <h2
          className="mt-3 text-balance font-sans font-semibold tracking-tightish text-ink"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
        >
          Where the signal has run
        </h2>
        <p className="mt-3 max-w-measure text-pretty leading-relaxed text-ink-muted">
          The roles and schooling behind the stack above, most recent first.
        </p>

        <ol ref={listRef} className="relative mt-14">
          {/* Resting spine */}
          <span
            aria-hidden
            className={`absolute ${RAIL} bottom-8 top-7 w-px -translate-x-1/2 bg-hairline`}
          />
          {/* The trace, drawn on scroll */}
          <motion.span
            aria-hidden
            style={reduce ? { scaleY: 1 } : { scaleY: scrollYProgress }}
            className={`absolute ${RAIL} bottom-8 top-7 w-px origin-top -translate-x-1/2 bg-infra`}
          />
          {/* Lime "now / me" anchor at the spine head — present day; history flows down.
              The page thread docks here (consolidates the old lime "running" chip). */}
          <div
            ref={nowRef}
            aria-hidden
            className={`absolute ${RAIL} -top-1 z-20 -translate-x-1/2`}
          >
            <span className="relative flex h-3 w-3 items-center justify-center">
              {!reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live/40" />
              )}
              <span className="relative h-2.5 w-2.5 rounded-full bg-live shadow-[0_0_10px_2px_rgba(204,255,0,0.5)]" />
            </span>
          </div>
          {/* Invisible clone of the trace — its bottom edge is the live trace tip the page
              thread follows, kept perfectly in sync with the cobalt line by construction. */}
          <motion.div
            aria-hidden
            style={reduce ? { scaleY: 1 } : { scaleY: scrollYProgress }}
            className={`pointer-events-none absolute ${RAIL} bottom-8 top-7 w-0 origin-top -translate-x-1/2`}
          >
            <div ref={tipRef} className="absolute bottom-0 left-0 h-0 w-0" />
          </motion.div>
          {experience.map((node: ExperienceEntry, i) => {
            const isHead = i === 0; // most-recent role = the live "running" deploy
            const bullets =
              node.bullets ?? (node.description ? [node.description] : []);
            const Glyph = ROLE_GLYPH[node.id];

            return (
              <li
                key={node.id}
                className="group relative grid grid-cols-[2.25rem_1fr] gap-x-2 pb-8 last:pb-0 sm:grid-cols-[3.25rem_2.5rem_1fr] sm:gap-x-3"
              >
                {/* Outside-left gutter — the year, scannable beside the spine (desktop) */}
                <div className="col-start-1 hidden pt-[18px] text-right font-mono text-xs leading-tight text-ink-muted transition-colors duration-200 group-hover:text-infra sm:block">
                  {node.period}
                </div>

                {/* Node on the spine — lights as the trace reaches it */}
                <Node
                  reduce={!!reduce}
                  isHead={isHead}
                  railClass={RAIL}
                  Glyph={Glyph}
                />

                {/* Connector tying the node to its card (brightens on hover) */}
                <span
                  aria-hidden
                  className={`absolute ${RAIL} top-[33px] hidden h-px w-8 bg-hairline transition-colors duration-200 group-hover:bg-infra/50 sm:top-[35px] sm:block`}
                />

                {/* Card — entry "pop" lives on the wrapper; hover lives on the inner
                    card (separate elements so framer's transform doesn't fight the CSS
                    hover transform). Scale + rise only, no opacity gate, so cards stay
                    visible on SSR / no-JS (see BUILD_LOG Entry 013). */}
                <motion.div
                  initial={reduce ? false : { scale: 0.96, y: 14 }}
                  whileInView={reduce ? undefined : { scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="col-start-2 will-change-transform sm:col-start-3"
                >
                  <div className="relative overflow-hidden rounded-lg border border-border-soft bg-surface p-5 transition-[transform,border-color,background-color] duration-200 ease-out-quint will-change-transform group-hover:-translate-y-0.5 group-hover:scale-[1.015] group-hover:border-infra/45 group-hover:bg-[#0d121c] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100 sm:p-6">
                  {/* Diagonal hover shine — a faint cool light sweep across the surface,
                      brightest top-left, clipped by the card's overflow-hidden */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(125deg,rgba(226,235,255,0.07)_0%,rgba(226,235,255,0.025)_26%,transparent_52%)] opacity-0 transition-opacity duration-300 ease-out-quint group-hover:opacity-100 motion-reduce:transition-none"
                  />
                  {/* Faint role glyph watermark */}
                  {Glyph && (
                    <Glyph
                      aria-hidden
                      strokeWidth={1.25}
                      className="pointer-events-none absolute -right-3 -top-3 z-0 h-28 w-28 text-ink opacity-[0.05] transition-opacity duration-300 group-hover:opacity-[0.09] sm:h-32 sm:w-32"
                    />
                  )}

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                      <h3 className="font-sans text-lg font-semibold tracking-tightish text-ink sm:text-xl">
                        {node.role}
                      </h3>
                    </div>

                    {/* Meta — org always; date only on mobile (desktop shows it in the gutter) */}
                    <p className="mt-1.5 font-mono text-xs text-ink-muted">
                      {node.org}
                      <span className="sm:hidden">
                        {node.org ? " · " : ""}
                        {node.period}
                      </span>
                    </p>

                    {/* Bullets — stagger in as the card enters view */}
                    {bullets.length > 0 && (
                      <motion.ul
                        variants={reduce ? undefined : listVariants}
                        initial={reduce ? false : "hidden"}
                        whileInView={reduce ? undefined : "show"}
                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                        className="mt-4 space-y-2.5"
                      >
                        {bullets.map((b, bi) => (
                          <motion.li
                            key={bi}
                            variants={reduce ? undefined : bulletVariants}
                            className="flex gap-3"
                          >
                            <span
                              aria-hidden
                              className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-infra/70 transition-colors duration-200 group-hover:bg-infra"
                            />
                            <span className="max-w-measure text-pretty text-sm leading-relaxed text-ink">
                              {b}
                            </span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}

                    {/* Tech chips with brand glyphs */}
                    {node.skills && node.skills.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {node.skills.map((c) => (
                          <li
                            key={c}
                            className="inline-flex items-center gap-1.5 rounded border border-border-soft bg-bg px-2 py-0.5 font-mono text-[11px] text-ink-muted transition-colors duration-200 group-hover:border-white/20 group-hover:text-ink"
                          >
                            <ChipIcon label={c} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Brand glyph for a tech chip — simple-icons path when known, else a sensible fallback. */
function ChipIcon({ label }: { label: string }) {
  const slug = CONNECTION_SLUG[label];
  const brand = slug ? ICONS[slug] : undefined;

  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        className="h-3 w-3 shrink-0"
      >
        <path d={brand.path} />
      </svg>
    );
  }
  // AWS (and other cloud labels) — no simple-icons mark available; use a clean glyph.
  if (/aws|cloud/i.test(label)) {
    return <Cloud aria-hidden className="h-3 w-3 shrink-0" strokeWidth={1.75} />;
  }
  return null;
}

/**
 * The node on the spine: a small role-icon token (echoing the canvas NodeToken) that
 * lights as the trace reaches it, scales up and gains a soft halo when its card is hovered.
 */
function Node({
  reduce,
  isHead,
  railClass,
  Glyph,
}: {
  reduce: boolean;
  isHead: boolean;
  railClass: string;
  Glyph?: LucideIcon;
}) {
  // Resting state is already visibly cobalt (never invisible) — the trace just
  // brightens the border and adds the glow as it reaches the node.
  const dim = { borderColor: "rgba(59,130,246,0.55)", boxShadow: "0 0 0 0 rgba(59,130,246,0)" };
  const lit = {
    borderColor: "rgba(59,130,246,1)",
    boxShadow: isHead
      ? "0 0 12px 2px rgba(59,130,246,0.45)"
      : "0 0 9px 1px rgba(59,130,246,0.35)",
  };

  return (
    <span
      aria-hidden
      className={`absolute ${railClass} top-[18px] z-10 -translate-x-1/2 transition-transform duration-200 ease-out-quint group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:top-5`}
    >
      {/* Soft halo that blooms when the card is hovered (separate from the trace glow) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-infra/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
      />
      <motion.span
        className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 bg-bg sm:h-[30px] sm:w-[30px]"
        initial={reduce ? lit : dim}
        whileInView={reduce ? undefined : lit}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {Glyph && (
          <Glyph
            aria-hidden
            strokeWidth={2}
            className="h-3.5 w-3.5 text-infra sm:h-4 sm:w-4"
          />
        )}
      </motion.span>
    </span>
  );
}
