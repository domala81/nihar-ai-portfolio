import NeuralPipeline from "@/components/pipeline/NeuralPipeline";
import OrbitalProjects from "@/components/projects/OrbitalProjects";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";

export default function Home() {
  return (
    <main>
      {/* Section 1 (hero) + Section 2 (interactive neural pipeline) — one continuous canvas */}
      <NeuralPipeline />

      {/* Section 3 — Projects "Output layer" (orbital + fixed detail panel). */}
      <OrbitalProjects />

      {/* Section 4 — Experience "Signal Trace". */}
      <ExperienceTimeline />

      {/* Contact stub — the full CLI contact node (Section 5) lands later. */}
      <section
        id="contact"
        className="min-h-contact flex flex-col justify-center border-t border-border-soft px-6 py-24 sm:px-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            Inference status
          </p>
          <h2
            className="mt-4 text-balance font-sans font-semibold tracking-tightish text-ink"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Ready to solve your problem next.
          </h2>
          <p className="mt-5 max-w-measure text-pretty leading-relaxed text-ink">
            The terminal contact node is coming to this page. For now, the fastest
            path is a direct line.
          </p>
          <a
            href="mailto:ndomala81@gmail.com"
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-md border border-border-soft bg-surface px-4 py-3 font-mono text-sm text-ink transition-colors duration-200 ease-out-quint hover:border-infra"
          >
            <span className="text-infra" aria-hidden>
              &gt;
            </span>
            ndomala81@gmail.com
          </a>
        </div>
      </section>
    </main>
  );
}
