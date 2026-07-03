// data/stats.ts

export type StatEntry = {
  id: string;
  /** The number, exactly as displayed — AnimatedMetric counts its digits up */
  value: string;
  label: string;
};

/** Production telemetry — the hero strip. Numbers pulled from experience bullets. */
export const stats: StatEntry[] = [
  { id: "records", value: "4.2B+", label: "records/day in production" },
  { id: "consumers", value: "14", label: "downstream consumers" },
  { id: "accuracy", value: "96.78%", label: "best model accuracy" },
  { id: "incidents", value: "15+", label: "sev incidents resolved" },
];
