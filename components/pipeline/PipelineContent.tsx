"use client";

import { LAYERS } from "./networkData";

/**
 * The pipeline's content as real DOM — one source, two roles:
 *  - variant="a11y"    (desktop interactive): an sr-only text alternative so the
 *    network's content lives in the accessibility tree, never locked in the canvas.
 *  - variant="visible" (mobile / reduced-motion / coarse pointer): the actual,
 *    readable Section 2 — a clean vertically-stacked layout of the five layers.
 */

type Props = { variant: "a11y" | "visible" };

export default function PipelineContent({ variant }: Props) {
  if (variant === "a11y") {
    return (
      <section aria-label="Skills and projects pipeline" className="sr-only">
        <h2>Skills and projects pipeline</h2>
        {LAYERS.map((layer) => (
          <div key={layer.index}>
            <h3>{layer.short}</h3>
            <ul>
              {layer.nodes.map((node) => (
                <li key={node.id}>
                  {node.label}
                  {node.org ? `, ${node.org}` : ""}
                  {node.date ? `, ${node.date}` : ""}
                  {node.description ? `. ${node.description}` : ""}
                  {node.metric ? ` ${node.metric}.` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      aria-label="Skills and projects pipeline"
      className="border-t border-border-soft px-6 py-20 sm:px-10"
    >
      <div className="mx-auto w-full max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">The pipeline</p>
        <h2 className="mt-3 text-balance font-sans text-2xl font-semibold tracking-tightish text-ink">
          From passions to shipped systems
        </h2>
        <p className="mt-3 max-w-measure text-pretty leading-relaxed text-ink-muted">
          Passions feed a core engineering and ML stack, flow into shipped projects and
          deployed experience, and converge on one result: ready for the next mission.
        </p>

        <div className="mt-12 flex flex-col gap-11">
          {LAYERS.map((layer) => (
            <div key={layer.index}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-infra" aria-hidden>
                  {String(layer.index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-mono text-sm uppercase tracking-widest text-ink">
                  {layer.short}
                </h3>
              </div>
              <ul className="mt-4 border-y border-hairline">
                {layer.nodes.map((node) => (
                  <li
                    key={node.id}
                    className="border-t border-hairline py-3 first:border-t-0"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-sans text-[15px] text-ink">{node.label}</span>
                      {(node.expertise || node.date) && (
                        <span className="shrink-0 font-mono text-[11px] text-ink-muted">
                          {node.expertise ?? node.date}
                        </span>
                      )}
                    </div>
                    {(node.org || node.metric || node.description) && (
                      <p className="mt-1 font-mono text-xs leading-relaxed text-ink-muted">
                        {node.org ? `${node.org} · ` : ""}
                        {node.metric ?? node.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
