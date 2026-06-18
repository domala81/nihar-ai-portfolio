import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Inference Engine palette (see DESIGN.md)
        bg: "#05070C",
        surface: "#0B0F17",
        ink: "#EDEFF2",
        "ink-muted": "#9CA3AF",
        live: "#CCFF00",
        infra: "#3B82F6",
        "infra-deep": "#1E40AF",
        hairline: "rgba(255,255,255,0.08)",
        "border-soft": "rgba(255,255,255,0.12)",
      },
      fontFamily: {
        // bound to next/font CSS variables in app/layout.tsx
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        display: "-0.035em",
        tightish: "-0.02em",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "14px",
      },
      maxWidth: {
        measure: "70ch",
      },
      transitionTimingFunction: {
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
