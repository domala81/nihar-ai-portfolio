"use client";

import { useEffect, useRef, useState } from "react";
import {
  cubicBezier,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Mail } from "lucide-react";
import ContactAnchor from "@/components/thread/ContactAnchor";
import { personal } from "@/data";

/**
 * Section 5 — The Convergent Output Node & Contact.
 *
 * The network's final station: the page-spanning lime thread docks onto the lime node here
 * (registered as the "contact" anchor in ContactAnchor), faint cobalt synapses converge into
 * it from above, and a restrained terminal block offers the direct lines. No form by design —
 * recruiters distrust no-confirmation forms; a real email + handles is the higher-trust path.
 *
 * The reveal is "curtain-flavored": as the section scrolls in (the experience→contact
 * transition), a soft mask wipe lifts down the stack while the synapses draw and the content
 * unfurls top→down, all driven by scroll progress and synced to the thread gliding onto the
 * node. It is *latched* — progresses with scroll, never un-reveals on scroll-up. The section
 * stays in normal document flow so the thread's docking math is untouched. Default markup ships
 * fully visible (SSR / no-JS / reduced-motion); the reveal only enhances once mounted on the
 * client with motion allowed.
 */

const EASE_FN = cubicBezier(0.22, 1, 0.36, 1);

/** Scroll-driven reveal for one element: fades up (opacity 0→1, y 16→0) over [start,end]. */
function useReveal(p: MotionValue<number>, start: number, end: number) {
  const opacity = useTransform(p, [start, end], [0, 1], { ease: EASE_FN });
  const y = useTransform(p, [start, end], [16, 0], { ease: EASE_FN });
  return { opacity, y };
}

const HEADING_SIZE = "clamp(1.75rem, 4vw, 2.75rem)";

type Channel = {
  label: string;
  value: string;
  /** external link (github/linkedin). Omitted for the email row, which copies instead. */
  href?: string;
  /** click copies the value to the clipboard rather than navigating (email). */
  copy?: boolean;
};

const CHANNELS: Channel[] = [
  { label: "email", value: personal.email, copy: true },
  { label: "github", value: personal.socials.github.display, href: personal.socials.github.href },
  { label: "linkedin", value: personal.socials.linkedin.display, href: personal.socials.linkedin.href },
];

// Converging synapses, in a 0–100 box: fan in from the top edge → all meet the node center.
const FAN_X = [6, 28, 50, 72, 94];
const CONVERGE = { x: 50, y: 72 };

export default function ContactSection() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll progress keyed to the CONTENT block (not the section): 0 as the content starts
  // entering (its top at viewport bottom) → 1 as the content is centered on screen. So the
  // reveal plays while the content rises through the middle of the viewport, where the eye is,
  // instead of finishing off-screen during entry. The footer below provides the runway that
  // makes "content centered" reachable; at rest the content sits in the upper viewport with the
  // footer beneath it (both visible — the contact is never scrolled out of view).
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start end", "center center"],
  });

  // Latched reveal: tracks the max progress so content stays revealed (never un-reveals).
  const revealed = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > revealed.get()) revealed.set(v);
  });

  // Client-only enhancement. Default markup ships fully visible (SSR / no-JS / reduced motion);
  // the reveal only attaches after mount. Seed the latch from current progress so a reload or
  // deep-link while already scrolled to contact shows the content instead of staying hidden.
  useEffect(() => {
    setMounted(true);
    revealed.set(scrollYProgress.get());
  }, [revealed, scrollYProgress]);

  const active = mounted && !reduce;

  // Per-element reveal windows over the latched progress (overlapping top→down stagger).
  const syn = useTransform(revealed, [0, 0.5], [0, 1], { ease: EASE_FN });
  const nodeOpacity = useTransform(revealed, [0.1, 0.45], [0, 1], {
    ease: EASE_FN,
  });
  const statusR = useReveal(revealed, 0.3, 0.6);
  const headR = useReveal(revealed, 0.42, 0.75);
  const proseR = useReveal(revealed, 0.55, 0.85);
  const ctaR = useReveal(revealed, 0.68, 0.95);
  const chR = useReveal(revealed, 0.78, 1);

  // Curtain-flavored soft mask wipe: a fade edge that lifts down the stack as it reveals.
  // Overshoots past 100% so the resting state is fully opaque (fully visible).
  const maskPos = useTransform(revealed, [0, 0.6], [10, 130], {
    ease: EASE_FN,
  });
  const maskImage = useMotionTemplate`linear-gradient(to bottom, #000 0%, #000 ${maskPos}%, transparent calc(${maskPos}% + 16%))`;

  const copyEmail = async () => {
    let ok = false;
    // Modern path: needs a secure context + user gesture (the real click provides it).
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(personal.email);
        ok = true;
      }
    } catch {
      /* denied/insecure — fall through to the execCommand fallback */
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = personal.email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {
        /* clipboard unavailable — say_hello mailto remains the path */
      }
    }
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-contact border-t border-border-soft px-6 py-24 sm:px-10"
    >
      <motion.div
        ref={contentRef}
        className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
        style={active ? { maskImage, WebkitMaskImage: maskImage } : undefined}
      >
        {/* Convergent node — faint cobalt synapses fan in and meet the lime "me" dot. */}
        <motion.div
          className="relative mx-auto h-32 w-full max-w-xs"
          style={active ? { opacity: nodeOpacity } : undefined}
        >
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            style={{ mixBlendMode: "screen" }}
          >
            <defs>
              <linearGradient id="conv-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3B82F6" stopOpacity="0" />
                <stop offset="1" stopColor="#3B82F6" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            {FAN_X.map((x) => {
              const d = `M ${x} 4 Q ${x} 46 ${CONVERGE.x} ${CONVERGE.y}`;
              return active ? (
                <motion.path
                  key={x}
                  d={d}
                  fill="none"
                  stroke="url(#conv-fade)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  style={{ pathLength: syn, opacity: syn }}
                />
              ) : (
                <path
                  key={x}
                  d={d}
                  fill="none"
                  stroke="url(#conv-fade)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
          {/* Dot center pinned to the convergence point (kill ContactAnchor's own bottom margin). */}
          <div className="absolute left-1/2 top-[72%] z-10 -translate-x-1/2 -translate-y-1/2 [&>div]:mb-0">
            <ContactAnchor />
          </div>
        </motion.div>

        <motion.p
          style={active ? statusR : undefined}
          className="font-mono text-[0.8125rem] tracking-[0.04em] text-ink-muted"
        >
          <span className="text-live">●</span> inference_status: ready
        </motion.p>

        <motion.h2
          style={
            active
              ? { ...headR, fontSize: HEADING_SIZE }
              : { fontSize: HEADING_SIZE }
          }
          className="mt-4 text-balance font-sans font-semibold tracking-tightish text-ink"
        >
          Ready to solve your problem next.
        </motion.h2>

        <motion.p
          style={active ? proseR : undefined}
          className="mt-4 max-w-measure text-pretty leading-relaxed text-ink-muted"
        >
          Open to AI Systems Engineering roles. The fastest path is a direct
          line.
        </motion.p>

        {/* Primary CTA — reveal lives on the wrapper so the anchor keeps its CSS hover
            transform (a framer inline transform would override hover:-translate/scale). */}
        <motion.div style={active ? ctaR : undefined} className="mt-9">
          <a
            href={`mailto:${personal.email}`}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-infra bg-infra/10 px-5 py-3 font-mono text-sm text-infra transition-[box-shadow,transform] duration-200 ease-out-quint hover:-translate-y-0.5 hover:scale-[1.06] hover:shadow-[0_0_22px_-2px_rgba(59,130,246,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(125deg,rgba(226,235,255,0.12)_0%,rgba(226,235,255,0.04)_30%,transparent_60%)] opacity-0 transition-opacity duration-300 ease-out-quint group-hover:opacity-100 motion-reduce:transition-none"
            />
            <Mail aria-hidden className="relative z-10 h-4 w-4" />
            <span className="relative z-10">Say hello</span>
          </a>
        </motion.div>

        {/* Direct channels — terminal listing. Email copies to clipboard; github/linkedin open. */}
        <motion.div
          style={active ? chR : undefined}
          className="mt-9 w-fit text-left font-mono text-sm"
        >
          {CHANNELS.map((c) => {
            const rowClass =
              "group grid grid-cols-[1.25rem_5rem_1fr] items-baseline gap-x-1 rounded-sm py-2 transition-colors duration-200 ease-out-quint";
            const inner = (
              <>
                <span
                  aria-hidden
                  className="text-infra transition-colors duration-200 group-hover:text-live"
                >
                  &gt;
                </span>
                <span className="text-ink-muted">{c.label}</span>
                <span className="inline-flex items-baseline">
                  <span className="relative w-fit text-ink-muted transition-colors duration-200 ease-out-quint group-hover:text-ink">
                    {c.value}
                    <span
                      aria-hidden
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-live transition-transform duration-300 ease-out-quint group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  </span>
                  {c.copy && (
                    <span aria-live="polite" className="ml-3 text-live">
                      {copied ? "copied ✓" : ""}
                    </span>
                  )}
                </span>
              </>
            );
            return c.copy ? (
              <button
                key={c.label}
                type="button"
                onClick={copyEmail}
                title="Click to copy"
                aria-label={`Copy email address ${c.value}`}
                className={`${rowClass} w-full cursor-pointer text-left`}
              >
                {inner}
              </button>
            ) : (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer noopener"
                className={rowClass}
              >
                {inner}
              </a>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
