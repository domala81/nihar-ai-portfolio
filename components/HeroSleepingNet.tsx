"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// ─── tunables ────────────────────────────────────────────────────────────────
const DOT_COUNT = 44;
const LINE_THRESHOLD = 155;   // px — max distance to draw a connecting line
const INFLUENCE_RADIUS = 190; // px — mouse pulls dots within this radius
const MAX_PULL = 38;          // px — max displacement from base position
const SPRING = 0.055;         // interpolation factor per frame (~60 fps feel)
const DOT_RADIUS = 1.5;       // canvas units
// ─────────────────────────────────────────────────────────────────────────────

interface Dot {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  /** 0–1 proximity-driven activation, lerped each frame */
  activation: number;
}

export default function HeroSleepingNet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = 0;

    // ── layout ──────────────────────────────────────────────────────────────
    function initDots() {
      dots = Array.from({ length: DOT_COUNT }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return { baseX: x, baseY: y, x, y, activation: 0 };
      });
    }

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * devicePixelRatio;
      canvas!.height = height * devicePixelRatio;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      initDots();
    }

    // ── draw loop ────────────────────────────────────────────────────────────
    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // 1. update dots
      for (const dot of dots) {
        if (!reduce) {
          const distToBase = Math.hypot(mouse.x - dot.baseX, mouse.y - dot.baseY);
          const targetActivation =
            distToBase < INFLUENCE_RADIUS
              ? 1 - distToBase / INFLUENCE_RADIUS
              : 0;

          let targetX = dot.baseX;
          let targetY = dot.baseY;

          if (targetActivation > 0) {
            const pullX = (mouse.x - dot.baseX) * targetActivation * 0.6;
            const pullY = (mouse.y - dot.baseY) * targetActivation * 0.6;
            const len = Math.hypot(pullX, pullY);
            if (len > 0) {
              const capped = Math.min(len, MAX_PULL);
              targetX = dot.baseX + (pullX / len) * capped;
              targetY = dot.baseY + (pullY / len) * capped;
            }
          }

          dot.x += (targetX - dot.x) * SPRING;
          dot.y += (targetY - dot.y) * SPRING;
          dot.activation += (targetActivation - dot.activation) * 0.07;
        }
      }

      // 2. draw lines (behind dots)
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist >= LINE_THRESHOLD) continue;

          const proximity = 1 - dist / LINE_THRESHOLD;
          const act = !reduce ? Math.max(a.activation, b.activation) : 0;

          let r = 255, g = 255, bl = 255;
          let alpha: number;

          if (act > 0.01) {
            // shift toward cobalt (#3b82f6 = 59 130 246)
            r = Math.round(255 + (59 - 255) * act);
            g = Math.round(255 + (130 - 255) * act);
            bl = Math.round(255 + (246 - 255) * act);
            alpha = 0.08 * proximity + act * 0.22;
          } else {
            alpha = 0.08 * proximity;
          }

          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.strokeStyle = `rgba(${r},${g},${bl},${alpha.toFixed(3)})`;
          ctx!.lineWidth = 0.7;
          ctx!.stroke();
        }
      }

      // 3. draw dots (above lines)
      for (const dot of dots) {
        const act = !reduce ? dot.activation : 0;
        const r = Math.round(255 + (59 - 255) * act);
        const g = Math.round(255 + (130 - 255) * act);
        const bl = Math.round(255 + (246 - 255) * act);
        const alpha = 0.25 + act * 0.45;

        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${bl},${alpha.toFixed(3)})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    // Pause the loop entirely while the hero is scrolled out of view.
    let inView = true;
    let running = false;
    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // ── events ───────────────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() {
      mouse = { x: -9999, y: -9999 };
    }

    // ── init ─────────────────────────────────────────────────────────────────
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const parent = canvas.parentElement!;
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) startLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    io.observe(parent);
    if (inView) startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    />
  );
}
