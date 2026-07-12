"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Dumbbell, MapPin, Mountain, UserRound } from "lucide-react";
import { about, personal } from "@/data";
import { registerAnchor } from "../thread/anchorStore";

/**
 * Section — "Operator File": the about-me as a dossier being read.
 *
 * Left: a tall "scanned" portrait anchor — cobalt duotone, faint hairline grid,
 * corner brackets, and a one-shot lime scan line when the section enters view
 * (placeholder panel until a real public/operator.jpg lands; flip
 * data/about.ts photo.ready). Right: the bio card (childhood → now arc) with
 * the "operator_vitals" rings beside it — self-reported personality metrics
 * as fitness-style rings that sweep from zero with a synced count-up — then
 * a currently_exploring
 * terminal ticker beside a compact hobbies strip — icons + an auto-cycling
 * typewriter caption (name shown statically, tagline typed) that pins to
 * whichever icon is hovered/focused. A faint topographic contour watermark
 * sits behind the hobbies strip (a nod to the trails). Everything is sized to
 * keep the whole section inside one desktop viewport.
 *
 * Motion is enhancement-only (scale/y, no opacity gates), honors reduced
 * motion (typewriter becomes a static caption, rings pre-filled), and the
 * lime budget is two small marks: the scan line and the one live vitals
 * ring. Stays in normal flow; that live ("curiosity") ring is the section's
 * thread anchor — the page's traveling lime dot docks in its center.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

/* ── Hobby glyphs ─────────────────────────────────────────────────────────
   Lucide covers trekking + gym; badminton (shuttlecock) and ping pong
   (paddle) are hand-drawn in the same 24px / stroke-current grammar. */

function ShuttlecockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="18.5" r="2.5" />
      <path d="M10.2 16.2 6 4.5" />
      <path d="M12 16v-13" />
      <path d="M13.8 16.2 18 4.5" />
      <path d="M6 4.5c2-.9 10-.9 12 0" />
    </svg>
  );
}

function PaddleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="10" cy="9.5" r="6.5" />
      <path d="m14.6 14.1 4.9 4.9" />
      <circle cx="19.5" cy="6" r="1.25" />
    </svg>
  );
}

const HOBBY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  trekking: Mountain,
  badminton: ShuttlecockIcon,
  pingpong: PaddleIcon,
  gym: Dumbbell,
};

/* ── Hobbies strip: icons + auto-cycling typewriter caption ─────────────── */

function HobbiesStrip({ reduce }: { reduce: boolean }) {
  const [pinned, setPinned] = useState<string | null>(null);
  const [cycleIdx, setCycleIdx] = useState(0);
  const [text, setText] = useState("");
  const textRef = useRef("");

  const hobbies = about.hobbies;
  const active = pinned
    ? (hobbies.find((h) => h.id === pinned) ?? hobbies[0])
    : hobbies[cycleIdx % hobbies.length];
  const target = active.tagline;

  // Typewriter: erase what no longer matches, then type toward the target.
  useEffect(() => {
    if (reduce) {
      textRef.current = target;
      setText(target);
      return;
    }
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (!alive) return;
      const cur = textRef.current;
      if (!target.startsWith(cur)) {
        textRef.current = cur.slice(0, -1);
        setText(textRef.current);
        timer = setTimeout(step, 14);
      } else if (cur.length < target.length) {
        textRef.current = target.slice(0, cur.length + 1);
        setText(textRef.current);
        timer = setTimeout(step, 28);
      }
    };
    step();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [target, reduce]);

  // Auto-advance while nothing is pinned.
  useEffect(() => {
    if (reduce || pinned) return;
    const t = setInterval(
      () => setCycleIdx((i) => (i + 1) % hobbies.length),
      4600,
    );
    return () => clearInterval(t);
  }, [reduce, pinned, hobbies.length]);

  return (
    <div className="relative overflow-hidden rounded-lg border border-border-soft bg-surface p-4 sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        When the laptop closes
      </p>

      <div className="relative mt-3 flex items-center gap-2">
        {hobbies.map((h) => {
          const Icon = HOBBY_ICONS[h.id] ?? Mountain;
          const isActive = active.id === h.id;
          return (
            <button
              key={h.id}
              type="button"
              aria-label={`${h.label}: ${h.tagline}`}
              onMouseEnter={() => setPinned(h.id)}
              onMouseLeave={() => setPinned(null)}
              onFocus={() => setPinned(h.id)}
              onBlur={() => setPinned(null)}
              className={`flex h-11 w-11 items-center justify-center rounded-md border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-live sm:h-8 sm:w-8 ${
                isActive
                  ? "border-infra/60 bg-infra/10 text-infra"
                  : "border-hairline text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Caption slot — hard-fixed height (fits 2 lines) so typing never resizes the card */}
      <p
        className="relative mt-2.5 h-[3.25rem] overflow-hidden border-t border-hairline pt-2 font-mono text-[12px] leading-relaxed text-ink-muted"
        aria-live="polite"
      >
        <span className="text-infra">&gt;</span>{" "}
        <span className="text-ink">{active.label.toLowerCase()}:</span> {text}
        {!reduce && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block text-ink"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              duration: 1.1,
              times: [0, 0.5, 0.5, 1],
              repeat: Infinity,
              ease: "linear",
            }}
          >
            _
          </motion.span>
        )}
      </p>
    </div>
  );
}

/* ── Operator vitals: self-reported metrics as fitness-style rings ────────
   Each ring sweeps from zero to its value (Apple-fitness style) while the
   number counts up alongside, staggered top→bottom once the column scrolls
   into view. Reduced motion renders rings pre-filled with static numbers. */

const RING_DUR = 1.4;
const RING_STAGGER = 0.22;
const ringDelay = (i: number) => 0.15 + i * RING_STAGGER;

function VitalRow({
  vital,
  index,
  started,
  reduce,
  ringRef,
}: {
  vital: (typeof about.vitals)[number];
  index: number;
  started: boolean;
  reduce: boolean;
  ringRef?: React.Ref<SVGSVGElement>;
}) {
  const [display, setDisplay] = useState(reduce ? vital.value : 0);

  // Count-up synced to the ring sweep (same delay / duration / ease).
  useEffect(() => {
    if (reduce) {
      setDisplay(vital.value);
      return;
    }
    if (!started) return;
    const controls = animate(0, vital.value, {
      delay: ringDelay(index),
      duration: RING_DUR,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [started, reduce, vital.value, index]);

  const fillTarget = Math.min(vital.value, 100) / 100;

  return (
    <div className="flex items-center gap-3">
      <svg
        ref={ringRef}
        viewBox="0 0 40 40"
        className="h-11 w-11 shrink-0 -rotate-90"
        aria-hidden
      >
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          strokeWidth="3.5"
          className="stroke-hairline"
        />
        <motion.circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          className={vital.live ? "stroke-live" : "stroke-infra"}
          initial={reduce ? { pathLength: fillTarget } : { pathLength: 0 }}
          animate={
            reduce
              ? undefined
              : started
                ? { pathLength: fillTarget }
                : undefined
          }
          transition={{
            delay: ringDelay(index),
            duration: RING_DUR,
            ease: EASE,
          }}
        />
      </svg>
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink-muted">
        {vital.label}
      </span>
      <span
        className={`font-mono text-sm tabular-nums ${
          vital.live ? "text-ink" : "text-ink-muted"
        }`}
      >
        {display}%
      </span>
    </div>
  );
}

function VitalsRings({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const liveRingRef = useRef<SVGSVGElement>(null);
  // Fire late (rings ~35% up the viewport) so the sweep plays at eye level,
  // not while the column is still peeking in at the bottom edge.
  const inView = useInView(ref, { once: true, margin: "0px 0px -35% 0px" });

  // The one lime ring is the section's dock for the page thread: the traveling
  // dot leaves the experience trace tip and settles into its center.
  useEffect(
    () =>
      liveRingRef.current
        ? registerAnchor("about-curiosity", liveRingRef.current)
        : undefined,
    [],
  );

  return (
    <div ref={ref} className="flex h-full flex-col">
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        operator_vitals
      </p>
      <div className="mt-3 flex flex-1 flex-col justify-around gap-3">
        {about.vitals.map((v, i) => (
          <VitalRow
            key={v.id}
            vital={v}
            index={i}
            started={inView}
            reduce={reduce}
            ringRef={v.live ? liveRingRef : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default function OperatorFile() {
  const reduce = useReducedMotion() ?? false;
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitInView = useInView(portraitRef, {
    once: true,
    margin: "0px 0px -20% 0px",
  });

  const cardClass =
    "rounded-lg border border-border-soft bg-surface p-5 sm:p-6";
  const cardTitleClass =
    "font-mono text-[11px] uppercase tracking-wider text-ink-muted";

  return (
    <section
      id="about"
      aria-label="About — operator file"
      className="border-t border-border-soft px-6 py-10 sm:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          Operator file
        </p>
        <h2
          className="mt-3 text-balance font-sans font-semibold tracking-tightish text-ink"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
        >
          A bit about me
        </h2>
        <p className="mt-2 max-w-measure text-pretty leading-relaxed text-ink-muted">
          Bio, vitals, and hobbies.
        </p>

        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[280px_1fr]">
          {/* ── Left anchor: the scanned portrait ─────────────────────────── */}
          <motion.div
            ref={portraitRef}
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.985 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative flex flex-col overflow-hidden rounded-lg border border-border-soft bg-surface"
          >
            {/* File header strip */}
            <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              <span>operator.jpg</span>
              <span className={about.photo.ready ? "text-infra" : ""}>
                {about.photo.ready ? "scan complete" : "scan pending"}
              </span>
            </div>

            {/* Portrait area — 4:5 matches the source photo, so nothing crops until the
                column takes over at lg. Content un-clips top→bottom behind the scan line. */}
            <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:flex-1">
              <motion.div
                className="absolute inset-0"
                initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
                animate={
                  reduce
                    ? undefined
                    : portraitInView
                      ? { clipPath: "inset(0 0 0% 0)" }
                      : undefined
                }
                transition={{ duration: 1.8, ease: EASE }}
              >
                {about.photo.ready ? (
                  <>
                    {/* Real portrait: natural, no color filters (user call) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={about.photo.src}
                      alt={about.photo.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-bg/30"
                    />
                  </>
                ) : (
                  // Placeholder: dot-matrix silhouette awaiting the real file
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <UserRound
                      aria-hidden
                      strokeWidth={0.75}
                      className="h-28 w-28 text-infra/30"
                    />
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      awaiting operator.jpg
                    </p>
                  </div>
                )}

                {/* Faint scanned-file grid overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 28px)",
                  }}
                />

                {/* Corner brackets */}
                {(
                  [
                    "left-3 top-3 border-l-2 border-t-2",
                    "right-3 top-3 border-r-2 border-t-2",
                    "left-3 bottom-3 border-l-2 border-b-2",
                    "right-3 bottom-3 border-r-2 border-b-2",
                  ] as const
                ).map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`pointer-events-none absolute h-4 w-4 border-infra/50 ${pos}`}
                  />
                ))}
              </motion.div>

              {/* One-shot lime scan line — rides the reveal edge (same duration + ease) */}
              {!reduce && portraitInView && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-[2px] bg-live/80 shadow-[0_0_12px_2px_rgba(204,255,0,0.45)]"
                  initial={{ top: "0%", opacity: 0 }}
                  animate={{ top: "100%", opacity: [0, 0.85, 0.85, 0] }}
                  transition={{
                    top: { duration: 1.8, ease: EASE },
                    opacity: {
                      duration: 1.8,
                      times: [0, 0.06, 0.92, 1],
                      ease: "linear",
                    },
                  }}
                />
              )}
            </div>

            {/* Identity strip */}
            <div className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3">
              <span className="font-sans text-sm font-semibold tracking-tightish text-ink">
                {personal.name}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
                <MapPin aria-hidden className="h-3 w-3 text-infra" />
                {personal.location}
              </span>
            </div>
          </motion.div>

          {/* ── Right: asymmetric bento ───────────────────────────────────── */}
          <motion.div
            variants={reduce ? undefined : gridVariants}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="grid gap-6"
          >
            {/* Top row — bio card beside its own vitals card */}
            <div className="grid gap-6 md:grid-cols-[1fr_240px]">
              <motion.div
                variants={reduce ? undefined : cardVariants}
                className={cardClass}
              >
                <p className={cardTitleClass}>How I got here</p>
                <div className="mt-3 max-w-[72ch] space-y-2">
                  {about.bio.map((line, i) => (
                    <p
                      key={i}
                      className="text-pretty text-sm leading-normal text-ink"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={reduce ? undefined : cardVariants}
                className="rounded-lg border border-border-soft bg-surface p-4 sm:p-5"
              >
                <VitalsRings reduce={reduce} />
              </motion.div>
            </div>

            {/* Bottom row — sandbox ticker beside the hobbies strip */}
            <div className="grid gap-6 sm:grid-cols-2">
              <motion.div
                variants={reduce ? undefined : cardVariants}
                className="rounded-lg border border-border-soft bg-surface p-4 sm:p-5"
              >
                <p className={cardTitleClass}>Currently exploring</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {about.exploring.map((item) => (
                    <span
                      key={item}
                      className="rounded-sm border border-hairline bg-bg/60 px-2 py-1 font-mono text-[11px] text-ink-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={reduce ? undefined : cardVariants}>
                <HobbiesStrip reduce={reduce} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
