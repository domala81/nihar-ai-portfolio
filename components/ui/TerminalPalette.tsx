"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { personal } from "@/data";

/**
 * ⌘K terminal — the command-palette easter egg, in the site's terminal grammar.
 * Opens on ⌘K / Ctrl+K, closes on Escape or backdrop click. A tiny command set
 * that answers questions and drives the page (scroll / open links). Desktop
 * pointer-users mostly; harmless if opened elsewhere.
 */

type Line = { text: string; tone?: "cmd" | "ok" | "muted" };

const PROMPT = "nihar@portfolio:~$";

const HELP: Line[] = [
  { text: "available commands:", tone: "muted" },
  { text: "  whoami      who is this" },
  { text: "  resume      open the résumé (pdf)" },
  { text: "  projects    jump to the output layer" },
  { text: "  experience  jump to the signal trace" },
  { text: "  contact     jump to the direct lines" },
  { text: "  github      open github profile" },
  { text: "  linkedin    open linkedin profile" },
  { text: "  clear       clear the terminal" },
  { text: "  exit        close this" },
];

export default function TerminalPalette() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setLines((l) =>
        l.length ? l : [{ text: "type `help` to see what this can do", tone: "muted" }],
      );
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const run = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const echo: Line = { text: `${PROMPT} ${raw}`, tone: "cmd" };
    const say = (out: Line[]) => setLines((l) => [...l, echo, ...out]);

    switch (cmd) {
      case "":
        setLines((l) => [...l, echo]);
        break;
      case "help":
      case "--help":
      case "nihar --help":
        say(HELP);
        break;
      case "whoami":
        say([
          { text: `${personal.name} — ${personal.tagline}`, tone: "ok" },
          { text: personal.subTagline, tone: "muted" },
        ]);
        break;
      case "resume":
      case "cv":
        say([{ text: "opening résumé…", tone: "ok" }]);
        window.open(personal.resume, "_blank", "noopener,noreferrer");
        break;
      case "projects":
        say([{ text: "jumping to the output layer…", tone: "ok" }]);
        setOpen(false);
        scrollToId("projects");
        break;
      case "experience":
        say([{ text: "tracing the signal…", tone: "ok" }]);
        setOpen(false);
        scrollToId("experience");
        break;
      case "contact":
      case "email":
        say([{ text: `${personal.email} — copied nowhere, opening the section…`, tone: "ok" }]);
        setOpen(false);
        scrollToId("contact");
        break;
      case "github":
        say([{ text: personal.socials.github.href, tone: "ok" }]);
        window.open(personal.socials.github.href, "_blank", "noopener,noreferrer");
        break;
      case "linkedin":
        say([{ text: personal.socials.linkedin.href, tone: "ok" }]);
        window.open(personal.socials.linkedin.href, "_blank", "noopener,noreferrer");
        break;
      case "sudo hire":
      case "hire":
        say([
          { text: "✓ request approved", tone: "ok" },
          { text: "run `contact` to complete the handshake", tone: "muted" },
        ]);
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "quit":
      case ":q":
        setOpen(false);
        break;
      default:
        say([
          { text: `command not found: ${cmd}`, tone: "muted" },
          { text: "try `help`", tone: "muted" },
        ]);
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-bg/70 px-4 pt-[18vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal command palette"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_24px_70px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
              <span className="font-mono text-[11px] text-ink-muted">{PROMPT}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                esc to close
              </span>
            </div>

            {/* Output */}
            <div
              ref={scrollRef}
              className="max-h-64 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
            >
              {lines.map((l, i) => (
                <p
                  key={i}
                  className={
                    l.tone === "cmd"
                      ? "text-ink"
                      : l.tone === "ok"
                        ? "text-live"
                        : "whitespace-pre-wrap text-ink-muted"
                  }
                >
                  {l.text}
                </p>
              ))}
            </div>

            {/* Input line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
                setInput("");
              }}
              className="flex items-center gap-2 border-t border-hairline px-4 py-3"
            >
              <span aria-hidden className="font-mono text-[13px] text-infra">
                &gt;
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="help"
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal command"
                className="w-full bg-transparent font-mono text-[13px] text-ink caret-live outline-none placeholder:text-ink-muted/50"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
