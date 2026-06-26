"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Github, Linkedin, FileText, ArrowDown } from "lucide-react";
import { personal } from "@/data";
import HeroSleepingNet from "@/components/HeroSleepingNet";
import HeroNodeSonar from "@/components/HeroNodeSonar";

const SOCIALS = [
  { label: "GitHub", href: personal.socials.github.href, Icon: Github },
  { label: "LinkedIn", href: personal.socials.linkedin.href, Icon: Linkedin },
];

export default function Hero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 },
    },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    // Presentational overlay only. The neural-network canvas + legibility gradient
    // now live in the shared stage (NeuralPipeline) so one network spans hero →
    // pipeline; NeuralPipeline fades this whole block out as the network resolves.
    <div className="min-h-hero relative">
      <HeroSleepingNet />

      {/* Me-node — right side of hero */}
      <div className="absolute right-[6%] xl:right-[10%] top-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
        <HeroNodeSonar />
      </div>
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="#top"
          className="relative inline-block font-mono text-sm tracking-tightish text-ink transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-infra after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 motion-reduce:after:hidden"
        >
          nihar<span className="text-ink-muted">.domala</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs text-ink-muted transition-colors hover:text-ink"
            >
              <Icon
                className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-px"
                aria-hidden
              />
              <span className="relative hidden sm:inline after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-infra after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:hidden">
                {label}
              </span>
            </a>
          ))}
          <a
            href={personal.resume}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md border border-border-soft px-3 py-2 font-mono text-xs text-ink-muted transition-colors hover:border-infra hover:text-ink"
          >
            <FileText className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Résumé</span>
          </a>
        </nav>
      </header>

      {/* Hero content */}
      <motion.div
        id="top"
        variants={container}
        initial="hidden"
        animate="show"
        className="min-h-hero relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-6 pb-28 pt-28 sm:px-10"
      >
        {/* Status pill */}
        <motion.div variants={item} className="mb-7">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border-soft bg-surface/60 px-3.5 py-1.5 font-mono text-xs text-ink-muted backdrop-blur-sm">
            <StatusDot reduce={!!reduce} />
            {personal.statusPill}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-balance font-sans font-semibold leading-[0.95] tracking-display text-ink"
          style={{ fontSize: "clamp(2.75rem, 9vw, 5.75rem)" }}
        >
          {personal.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="mt-6 max-w-measure text-pretty text-lg leading-relaxed text-ink sm:text-xl"
        >
          <span className="font-mono text-base text-infra sm:text-lg">
            {personal.tagline}.
          </span>{" "}
          Building the infrastructure that puts models into production.
        </motion.p>

        {/* Location */}
        <motion.div
          variants={item}
          className="mt-5 flex flex-col items-start gap-1.5 font-mono text-xs text-ink-muted sm:flex-row sm:items-center sm:gap-3"
        >
          <span>{personal.location}</span>
          <span
            className="hidden h-px w-8 bg-border-soft sm:block"
            aria-hidden
          />
          <span>Open to AI / Data / Cloud roles</span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-md border border-infra bg-infra/10 px-5 py-3 font-mono text-sm text-infra transition-all duration-200 ease-out-quint hover:-translate-y-px hover:bg-infra hover:text-bg motion-reduce:hover:translate-y-0"
          >
            Get in touch
            <span
              aria-hidden
              className="transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          <a
            href={personal.resume}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md border border-border-soft px-5 py-3 font-mono text-sm text-ink transition-all duration-200 ease-out-quint hover:-translate-y-px hover:border-ink/40 motion-reduce:hover:translate-y-0"
          >
            <FileText className="h-4 w-4" aria-hidden />
            Download résumé
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue — decorative; invites scrolling down into the resolving network */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.1, duration: 0.6 }}
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted"
      >
        Scroll
        <motion.span
          animate={reduce ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </div>
  );
}

function StatusDot({ reduce }: { reduce: boolean }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      {!reduce && (
        <motion.span
          className="absolute inline-flex h-full w-full rounded-full bg-live"
          animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
    </span>
  );
}
