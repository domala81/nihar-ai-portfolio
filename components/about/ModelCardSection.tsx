"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FileCode2 } from "lucide-react";
import { modelCard, personal } from "@/data";

/**
 * Section — the "About", written as a model card (the HuggingFace grammar,
 * pointed at a person). A terminal-file card: `$ cat nihar.model_card.md`
 * header, then Architecture / Training data / Benchmarks / Intended use /
 * Known limitations. This is where the human voice lives — the rest of the
 * site is the network's voice. Content in data/modelCard.ts.
 */

export default function ModelCardSection() {
  const reduce = useReducedMotion();

  const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="model-card"
      aria-label="About — model card"
      className="border-t border-border-soft px-6 py-24 sm:px-10"
    >
      <div className="mx-auto w-full max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          Model card
        </p>
        <h2
          className="mt-3 text-balance font-sans font-semibold tracking-tightish text-ink"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
        >
          Who&apos;s behind the network
        </h2>
        <p className="mt-3 max-w-measure text-pretty leading-relaxed text-ink-muted">
          {modelCard.summary}
        </p>

        {/* The file card */}
        <div className="mt-12 overflow-hidden rounded-lg border border-border-soft bg-surface">
          {/* Terminal header */}
          <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3 sm:px-6">
            <p className="flex items-center gap-2 font-mono text-xs text-ink-muted">
              <FileCode2 className="h-3.5 w-3.5 text-infra" aria-hidden />
              <span>
                <span className="text-infra">$</span> cat {modelCard.filename}
              </span>
            </p>
            <span className="rounded-sm border border-border-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {personal.name.split(" ")[0].toLowerCase()} · {modelCard.version}
            </span>
          </div>

          <motion.dl
            variants={reduce ? undefined : listVariants}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            className="flex flex-col gap-7 px-5 py-6 sm:px-6 sm:py-7"
          >
            {modelCard.sections.map((s) => (
              <motion.div key={s.id} variants={reduce ? undefined : itemVariants}>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-infra">
                  ## {s.heading}
                </dt>
                <dd className="mt-2">
                  {s.lines.length === 1 ? (
                    <p className="max-w-measure text-pretty text-sm leading-relaxed text-ink">
                      {s.lines[0]}
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {s.lines.map((line, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink">
                          <span
                            aria-hidden
                            className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-infra/70"
                          />
                          <span className="max-w-measure text-pretty">{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
