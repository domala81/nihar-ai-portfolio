import NeuralPipeline from "@/components/pipeline/NeuralPipeline";
import OrbitalProjects from "@/components/projects/OrbitalProjects";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import LimeThread from "@/components/thread/LimeThread";
import ContactSection from "@/components/contact/ContactSection";
import SiteFooter from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <main>
      {/* PROTOTYPE — the lime "me" node threading the whole page (feature/lime-thread). */}
      <LimeThread />
      {/* Section 1 (hero) + Section 2 (interactive neural pipeline) — one continuous canvas */}
      <NeuralPipeline />

      {/* Section 3 — Projects "Output layer" (orbital + fixed detail panel). */}
      <OrbitalProjects />

      {/* Section 4 — Experience "Signal Trace". */}
      <ExperienceTimeline />

      {/* Section 5 — Convergent Output Node + direct-contact terminal. */}
      <ContactSection />

      {/* Footer — "inference colophon" (copyright · build credit · back-to-top). */}
      <SiteFooter />
    </main>
  );
}
