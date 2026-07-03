"use client";

import { useEffect } from "react";
import { personal } from "@/data";

/**
 * Easter egg for the engineers who open devtools (they will): a styled
 * console signature with the direct line. Renders nothing.
 */

let printed = false;

export default function ConsoleSignature() {
  useEffect(() => {
    if (printed) return;
    printed = true;
    /* eslint-disable no-console */
    console.log(
      "%c● INFERENCE: LIVE",
      "color:#CCFF00; background:#05070C; font-family:monospace; font-size:12px; padding:6px 10px; border:1px solid rgba(204,255,0,0.4); border-radius:4px;",
    );
    console.log(
      `%cYou opened the console. Good instinct — that's exactly the kind of person I want to work with.\n\n> whoami   ${personal.name} · ${personal.tagline}\n> contact  ${personal.email}\n> github   ${personal.socials.github.href}\n\nP.S. try ⌘K on the page.`,
      "color:#9CA3AF; font-family:monospace; font-size:12px; line-height:1.7;",
    );
    /* eslint-enable no-console */
  }, []);

  return null;
}
