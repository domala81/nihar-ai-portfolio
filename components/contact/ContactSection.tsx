"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Mail } from "lucide-react";
import ContactAnchor from "@/components/thread/ContactAnchor";

const EMAIL = "ndomala81@gmail.com";

/**
 * Section 5 — The Convergent Output Node & Contact.
 *
 * The network's final station: the page-spanning lime thread docks onto the lime node here
 * (registered as the "contact" anchor in ContactAnchor), faint cobalt synapses converge into
 * it from above, and a restrained terminal block offers the direct lines. No form by design —
 * recruiters distrust no-confirmation forms; a real email + handles is the higher-trust path.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type Channel = {
  label: string;
  value: string;
  /** external link (github/linkedin). Omitted for the email row, which copies instead. */
  href?: string;
  /** click copies the value to the clipboard rather than navigating (email). */
  copy?: boolean;
};

const CHANNELS: Channel[] = [
  { label: "email", value: EMAIL, copy: true },
  { label: "github", value: "/domala81", href: "https://github.com/domala81" },
  {
    label: "linkedin",
    value: "/in/nihar-domala",
    href: "https://www.linkedin.com/in/nihar-domala/",
  },
];

// Converging synapses, in a 0–100 box: fan in from the top edge → all meet the node center.
const FAN_X = [6, 28, 50, 72, 94];
const CONVERGE = { x: 50, y: 72 };

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

export default function ContactSection() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    let ok = false;
    // Modern path: needs a secure context + user gesture (the real click provides it).
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(EMAIL);
        ok = true;
      }
    } catch {
      /* denied/insecure — fall through to the execCommand fallback */
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = EMAIL;
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
        className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
        variants={container}
        initial={reduce ? false : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      >
        {/* Convergent node — faint cobalt synapses fan in and meet the lime "me" dot. */}
        <motion.div
          variants={item}
          className="relative mx-auto h-32 w-full max-w-xs"
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
              return reduce ? (
                <path
                  key={x}
                  d={d}
                  fill="none"
                  stroke="url(#conv-fade)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ) : (
                <motion.path
                  key={x}
                  d={d}
                  fill="none"
                  stroke="url(#conv-fade)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  variants={draw}
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
          variants={item}
          className="font-mono text-[0.8125rem] tracking-[0.04em] text-ink-muted"
        >
          <span className="text-live">●</span> inference_status: ready
        </motion.p>

        <motion.h2
          variants={item}
          className="mt-4 text-balance font-sans font-semibold tracking-tightish text-ink"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
        >
          Ready to solve your problem next.
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-4 max-w-measure text-pretty leading-relaxed text-ink-muted"
        >
          Open to AI Systems Engineering roles. The fastest path is a direct
          line.
        </motion.p>

        {/* Primary CTA — cobalt hero-style button; hover = border glow + card-style shine (no fill). */}
        <motion.a
          variants={item}
          href="mailto:ndomala81@gmail.com"
          className="group relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-md border border-infra bg-infra/10 px-5 py-3 font-mono text-sm text-infra transition-[box-shadow,transform] duration-200 ease-out-quint hover:-translate-y-0.5 hover:scale-[1.2] hover:shadow-[0_0_22px_-2px_rgba(59,130,246,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(125deg,rgba(226,235,255,0.12)_0%,rgba(226,235,255,0.04)_30%,transparent_60%)] opacity-0 transition-opacity duration-300 ease-out-quint group-hover:opacity-100 motion-reduce:transition-none"
          />
          <Mail aria-hidden className="relative z-10 h-4 w-4" />
          <span className="relative z-10">Say hello</span>
        </motion.a>

        {/* Direct channels — terminal listing. Email copies to clipboard; github/linkedin open. */}
        <motion.div
          variants={item}
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
