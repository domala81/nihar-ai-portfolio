"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { registerAnchor } from "./anchorStore";

/**
 * The lime "me" node for the contact section — the page thread's final dock, previewing
 * the planned Section 5 convergent output node. Also stands alone as a static lime dot.
 */
export default function ContactAnchor() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => (ref.current ? registerAnchor("contact", ref.current) : undefined), []);

  return (
    <div ref={ref} aria-hidden className="mb-10 inline-flex">
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute -inset-1 rounded-full bg-live/20 blur-md" />
        {!reduce && (
          <span className="absolute inset-0 animate-ping rounded-full border border-live/30" />
        )}
        <span className="relative h-3.5 w-3.5 rounded-full bg-live shadow-[0_0_16px_3px_rgba(204,255,0,0.5)]" />
      </span>
    </div>
  );
}
