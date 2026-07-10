import NeuralPipeline from "@/components/pipeline/NeuralPipeline";
import OrbitalProjects from "@/components/projects/OrbitalProjects";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import OperatorFile from "@/components/about/OperatorFile";
import LimeThread from "@/components/thread/LimeThread";
import ContactSection from "@/components/contact/ContactSection";
import SiteFooter from "@/components/footer/SiteFooter";
import InferenceProgress from "@/components/ui/InferenceProgress";
import TerminalPalette from "@/components/ui/TerminalPalette";
import ConsoleSignature from "@/components/ui/ConsoleSignature";

export default function Home() {
  return (
    <main>
      {/* Top hairline — page scroll as inference progress (cobalt fill, lime tip). */}
      <InferenceProgress />
      {/* ⌘K terminal + devtools console signature (easter eggs). */}
      <TerminalPalette />
      <ConsoleSignature />
      {/* PROTOTYPE — the lime "me" node threading the whole page (feature/lime-thread). */}
      <LimeThread />
      {/* Section 1 (hero) + Section 2 (interactive neural pipeline) — one continuous canvas */}
      <NeuralPipeline />

      {/* Section 3 — Projects "Output layer" (orbital + fixed detail panel). */}
      <OrbitalProjects />

      {/* Section 4 — Experience "Signal Trace". */}
      <ExperienceTimeline />

      {/* Section 4.5 — About, as an "Operator File" dossier (the human voice). */}
      <OperatorFile />

      {/* Section 5 — Convergent Output Node + direct-contact terminal. */}
      <ContactSection />

      {/* Footer — "inference colophon" (copyright · build credit · back-to-top). */}
      <SiteFooter />
    </main>
  );
}
