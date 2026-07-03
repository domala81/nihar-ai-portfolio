"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Impact-metric text whose numbers count up from 0 the first time it scrolls
 * into view (e.g. "support cost −90%" animates 0→90). Slow ease-out, ~1.2s.
 * Four-digit integers in 1900–2100 are treated as years and left alone
 * ("IEEE INDICON 2023" must not count up). Reduced motion renders statically.
 */

const DURATION_MS = 1200;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Token = { text: string; target?: number; decimals?: number };

function tokenize(text: string): Token[] {
  return text.split(/(\d+(?:\.\d+)?)/).map((part) => {
    if (!/^\d/.test(part)) return { text: part };
    const value = parseFloat(part);
    const isYear = /^\d{4}$/.test(part) && value >= 1900 && value <= 2100;
    if (isYear) return { text: part };
    const decimals = part.includes(".") ? part.split(".")[1].length : 0;
    return { text: part, target: value, decimals };
  });
}

export default function AnimatedMetric({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [progress, setProgress] = useState(0);

  const tokens = tokenize(text);
  const animatable = !reduce && tokens.some((t) => t.target !== undefined);

  useEffect(() => {
    if (!inView || !animatable) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION_MS, 1);
      setProgress(easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, animatable]);

  return (
    <span ref={ref} className={className}>
      {tokens.map((t, i) =>
        t.target === undefined || !animatable ? (
          <span key={i}>{t.text}</span>
        ) : (
          // tabular-nums keeps the line from jittering while digits change
          <span key={i} style={{ fontVariantNumeric: "tabular-nums" }}>
            {(t.target * progress).toFixed(t.decimals)}
          </span>
        ),
      )}
    </span>
  );
}
