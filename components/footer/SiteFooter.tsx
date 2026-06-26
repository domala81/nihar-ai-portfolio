"use client";

import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { personal } from "@/data";

/**
 * Site footer — a compact "inference colophon".
 *
 * One tight centered block: a live machine-voice status line (cobalt dot + blinking terminal
 * cursor) over a single wrapping credit line (© · built with ♥ · stack). Back-to-top is pinned
 * to the right edge on desktop, inline on mobile. Debranded from the reference footer — no glass,
 * no glow on chrome. One lime mark only: the ♥ ("built with love" = the brand's *alive*); the
 * status dot is cobalt and the cursor is ink, so neither competes for the live signal.
 */
export default function SiteFooter() {
  const reduce = useReducedMotion();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-border-soft px-6 py-7 sm:px-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-center font-mono text-xs text-ink-muted">
        {/* Live machine-voice status — cobalt dot (done/structural) + blinking terminal cursor. */}
        <p className="flex items-center gap-2 tracking-[0.04em]">
          <span aria-hidden className="text-infra">
            ●
          </span>
          <span>
            session complete
            <motion.span
              aria-hidden
              className="ml-1 inline-block text-ink"
              animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 1.1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }
              }
            >
              _
            </motion.span>
          </span>
        </p>

        {/* Colophon — one wrapping line. The ♥ is the footer's single live signal. */}
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 leading-relaxed">
          <span>© {new Date().getFullYear()} {personal.name}</span>
          <span aria-hidden className="text-white/15">·</span>
          <span className="inline-flex items-center gap-1">
            built with
            <span aria-hidden className="text-live">
              ♥
            </span>
            <span className="sr-only">love</span>
          </span>
          <span aria-hidden className="text-white/15">·</span>
          <span>Next.js · Canvas · GSAP</span>
        </p>

        {/* Back to top — "rerun" the inference. Inline-centered on mobile, pinned right on desktop. */}
        <button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          className="group mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-border-soft text-ink-muted transition-colors duration-200 ease-out-quint hover:border-infra hover:text-ink sm:absolute sm:right-10 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        >
          <ArrowUp
            aria-hidden
            className="h-4 w-4 transition-transform duration-300 ease-out-quint group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
          />
        </button>
      </div>
    </footer>
  );
}
