"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Hero from "../Hero";
import DetailCard from "./DetailCard";
import PipelineContent from "./PipelineContent";
import NodeToken, { type TokenState } from "./NodeToken";
import { ALL_NODES, LAYERS, LAYER_COUNTS, nodeByLabel, type NodeKind } from "./networkData";
import { registerAnchor } from "../thread/anchorStore";

/**
 * The Inference Engine — horizontal neural pipeline (Section 2), DOM/canvas hybrid.
 *
 * Scrolling clears the hero, then a self-playing **boot** runs once: the
 * "INITIALIZING INFERENCE ENGINE" loader fills on an EMPTY canvas, then the network
 * IGNITES — an energy wave sweeps left→right lighting each column — and the loader
 * converges into a top "● INFERENCE: LIVE" chip. The whole network is gated behind
 * `bootReveal` so it is never visible while it claims to be loading. After boot the
 * nodes drift + lean toward the cursor (magnetism), and a "hover to inspect" hint
 * cycles on random nodes (while on screen) until the first hover. Mobile / reduced
 * motion / coarse pointer degrade to the stacked PipelineContent list.
 */

const COLOR_INFRA = "59, 130, 246";
const MOBILE_BP = 768;
const SCENE_VH = 2.6;
const HERO_FADE_END = 0.24;
const BOOT_TRIGGER = 0.26;
const REVEAL_STAGGER = 0.13;
const REVEAL_BAND = 0.42;

// Node life
const DRIFT_AMP = 4;
const MAG_R = 150;
const MAG_PULL = 0.55;
const MAG_CAP = 7;
const OFFSET_EASE = 0.12;
// Ambient demo
const DEMO_EVERY = 3500;
const DEMO_SHOW = 2000;

type PNode = {
  id: string;
  label: string;
  kind: NodeKind;
  icon?: string;
  col: number;
  x: number;
  y: number;
  isCore: boolean;
};
type Layout = { w: number; h: number; size: number; cols: number[]; nodes: PNode[]; synapses: [number, number][] };
type Mo = { phX: number; phY: number; fX: number; fY: number; ox: number; oy: number };
type Packet = { syn: number; t: number; speed: number; dir: 1 | -1; flow: boolean };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const colReveal = (i: number, reveal: number) =>
  easeOutCubic(clamp((reveal - i * REVEAL_STAGGER) / REVEAL_BAND, 0, 1));

export default function NeuralPipeline() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const monikerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tokenRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const chipRef = useRef<HTMLDivElement | null>(null);

  const progressRef = useRef(0);
  const engineHoverRef = useRef<string | null>(null);
  const overNodeRef = useRef(false);
  const overCardRef = useRef(false);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInteractedRef = useRef(false);
  const demoIdRef = useRef<string | null>(null);
  const demoHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layoutRef = useRef<Layout | null>(null);
  const inViewRef = useRef(false);
  const netVisRef = useRef(0);
  const demoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bootRevealRef = useRef(0);
  const bootStartedRef = useRef(false);
  const bootedRef = useRef(false);
  const fireDemoRef = useRef<() => void>(() => {});

  const [interactive, setInteractive] = useState(true);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [demoId, setDemoId] = useState<string | null>(null);

  // Register the result (core) node as the "network" anchor for the page lime thread.
  useEffect(() => {
    const core = layout?.nodes.find((n) => n.isCore);
    const el = core ? tokenRefs.current[core.id] : null;
    return el ? registerAnchor("network", el) : undefined;
  }, [layout]);

  const clearActive = useCallback(() => {
    engineHoverRef.current = null;
    setActiveId(null);
  }, []);
  const requestClear = useCallback(() => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(() => {
      if (!overNodeRef.current && !overCardRef.current) clearActive();
    }, 150);
  }, [clearActive]);
  const activate = useCallback((id: string) => {
    if (!bootedRef.current) return;
    overNodeRef.current = true;
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    hasInteractedRef.current = true; // first hover stops the ambient demo
    if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    demoIdRef.current = null;
    setDemoId(null);
    engineHoverRef.current = id;
    setActiveId(id);
  }, []);
  const onNodeLeave = useCallback(() => {
    overNodeRef.current = false;
    requestClear();
  }, [requestClear]);
  const onCardEnter = useCallback(() => {
    overCardRef.current = true;
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
  }, []);
  const onCardLeave = useCallback(() => {
    overCardRef.current = false;
    requestClear();
  }, [requestClear]);
  const onChipClick = useCallback((label: string) => {
    const n = nodeByLabel(label);
    if (!n) return;
    engineHoverRef.current = n.id;
    setActiveId(n.id);
  }, []);

  // Show a "hover to inspect" hint on a random node — only while booted + on screen.
  const fireDemo = useCallback(() => {
    if (hasInteractedRef.current || !bootedRef.current || !inViewRef.current || netVisRef.current < 0.6)
      return;
    const lay = layoutRef.current;
    if (!lay) return;
    const candidates = lay.nodes.filter((n) => !n.isCore);
    if (!candidates.length) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    demoIdRef.current = pick.id;
    setDemoId(pick.id);
    if (demoHideRef.current) clearTimeout(demoHideRef.current);
    demoHideRef.current = setTimeout(() => {
      demoIdRef.current = null;
      setDemoId((cur) => (cur === pick.id ? null : cur));
    }, DEMO_SHOW);
  }, []);
  fireDemoRef.current = fireDemo;

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    const stage = stageRef.current;
    if (!canvas || !scene || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = (q: string) => window.matchMedia(q);
    let reduce = mq("(prefers-reduced-motion: reduce)").matches;
    const finePointer = mq("(pointer: fine)").matches;

    let lay: Layout | null = null;
    let mo: Mo[] = [];
    let packets: Packet[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let isMobile = false;
    let isInteractive = false;
    let idleAccum = 0;
    let flowAccum = 0;
    let iso = 0;
    const pointer = { x: 0, y: 0, inside: false };
    let bootTl: gsap.core.Timeline | null = null;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    function computeLayout(): Layout {
      const layersN = LAYER_COUNTS.length;
      const marginX = Math.min(w * 0.1, 150);
      const usableW = w - marginX * 2;
      const cols: number[] = [];
      for (let i = 0; i < layersN; i++) cols.push(marginX + (usableW * i) / (layersN - 1));
      const bandTop = h * 0.3;
      const bandBottom = h * 0.82;
      const size = Math.max(34, Math.min(46, w * 0.032));
      const nodes: PNode[] = [];
      let k = 0;
      LAYER_COUNTS.forEach((count, col) => {
        for (let i = 0; i < count; i++) {
          const x = cols[col];
          const y = count === 1 ? h * 0.52 : bandTop + ((bandBottom - bandTop) * i) / (count - 1);
          const d = ALL_NODES[k++];
          nodes.push({ id: d.id, label: d.label, kind: d.kind, icon: d.icon, col, x, y, isCore: col === layersN - 1 });
        }
      });
      const synapses: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++)
        for (let j = 0; j < nodes.length; j++)
          if (nodes[j].col === nodes[i].col + 1) synapses.push([i, j]);
      return { w, h, size, cols, nodes, synapses };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      lay = computeLayout();
      layoutRef.current = lay;
      mo = lay.nodes.map(() => ({
        phX: rand(0, Math.PI * 2),
        phY: rand(0, Math.PI * 2),
        fX: rand(0.6, 1.1),
        fY: rand(0.55, 1.0),
        ox: 0,
        oy: 0,
      }));
      packets = [];
      setLayout(lay);
    }

    function spawnIdle() {
      if (!lay || !lay.synapses.length) return;
      const syn = Math.floor(Math.random() * lay.synapses.length);
      const dir: 1 | -1 = Math.random() < 0.22 ? -1 : 1;
      packets.push({ syn, t: dir === 1 ? 0 : 1, speed: rand(0.005, 0.01), dir, flow: false });
    }
    function spawnFlow(hoverId: string) {
      if (!lay) return;
      const touching: { syn: number; from: 0 | 1 }[] = [];
      lay.synapses.forEach(([a, b], idx) => {
        if (lay!.nodes[a].id === hoverId) touching.push({ syn: idx, from: 0 });
        else if (lay!.nodes[b].id === hoverId) touching.push({ syn: idx, from: 1 });
      });
      if (!touching.length) return;
      const pick = touching[Math.floor(Math.random() * touching.length)];
      packets.push({ syn: pick.syn, t: pick.from === 0 ? 0 : 1, speed: rand(0.012, 0.02), dir: pick.from === 0 ? 1 : -1, flow: true });
    }

    function render() {
      if (!lay) return;
      const { nodes, synapses, size } = lay;
      const time = gsap.ticker.time;
      const reveal = bootRevealRef.current;
      const nv = netVisRef.current; // 0 = network hidden (at hero), 1 = shown (in section)
      ctx!.clearRect(0, 0, w, h);
      const hover = isInteractive && bootedRef.current ? engineHoverRef.current : null;
      iso += ((hover ? 1 : 0) - iso) * 0.16;

      // Reveal (boot wave) × net visibility drives token opacity (--rev) + moniker opacity.
      for (let i = 0; i < LAYER_COUNTS.length; i++) {
        const r = colReveal(i, reveal) * nv;
        stage!.style.setProperty(`--rev-${i}`, String(r));
        const m = monikerRefs.current[i];
        if (m) m.style.opacity = String(r);
      }

      // Live node positions: home + ambient drift + cursor magnetism (after boot).
      const lx: number[] = new Array(nodes.length);
      const ly: number[] = new Array(nodes.length);
      const live = bootedRef.current;
      const pointerActive = pointer.inside && live;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const m = mo[i];
        const rev = colReveal(n.col, reveal);
        let tx: number;
        let ty: number;
        if (!live || hover === n.id || demoIdRef.current === n.id) {
          tx = 0;
          ty = 0;
        } else {
          tx = Math.sin(time * m.fX + m.phX) * DRIFT_AMP;
          ty = Math.sin(time * m.fY + m.phY) * DRIFT_AMP * 0.8;
          if (pointerActive) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < MAG_R) {
              const f = 1 - d / MAG_R;
              tx += clamp(dx * f * f * MAG_PULL, -MAG_CAP, MAG_CAP);
              ty += clamp(dy * f * f * MAG_PULL, -MAG_CAP, MAG_CAP);
            }
          }
        }
        m.ox += (tx - m.ox) * OFFSET_EASE;
        m.oy += (ty - m.oy) * OFFSET_EASE;
        lx[i] = n.x + m.ox;
        ly[i] = n.y + m.oy;
        const half = (n.isCore ? size * 1.3 : size) / 2;
        const el = tokenRefs.current[n.id];
        if (el) el.style.transform = `translate(${m.ox - half}px, ${m.oy - half}px)`;
      }

      const litMap = new Map<number, number>();
      for (const pk of packets) litMap.set(pk.syn, Math.max(litMap.get(pk.syn) ?? 0, pk.flow ? 1 : pk.dir === 1 ? 0.7 : 0.4));

      // Synapses
      for (let i = 0; i < synapses.length; i++) {
        const [ai, bi] = synapses[i];
        const A = nodes[ai];
        const B = nodes[bi];
        const revLine = Math.min(colReveal(A.col, reveal), colReveal(B.col, reveal)) * nv;
        if (revLine <= 0.01) continue;
        const touches = hover !== null && (A.id === hover || B.id === hover);
        let lw = 1;
        if (touches) {
          ctx!.strokeStyle = `rgba(${COLOR_INFRA},${(0.06 + 0.44 * iso) * revLine})`;
          lw = 1.3;
        } else {
          const dimF = 1 - iso * 0.82;
          const l = litMap.get(i) ?? 0;
          if (l > 0 && hover === null) {
            ctx!.strokeStyle = `rgba(${COLOR_INFRA},${0.24 * l * revLine})`;
            lw = 1.1;
          } else {
            ctx!.strokeStyle = `rgba(255,255,255,${0.05 * revLine * dimF})`;
          }
        }
        ctx!.lineWidth = lw;
        ctx!.beginPath();
        ctx!.moveTo(lx[ai], ly[ai]);
        ctx!.lineTo(lx[bi], ly[bi]);
        ctx!.stroke();
      }

      // Ignite energy wave (only during boot reveal)
      if (reveal > 0.02 && reveal < 0.98) {
        const waveX = reveal * w;
        const grad = ctx!.createLinearGradient(waveX - 70, 0, waveX + 70, 0);
        const a = 0.12 + 0.4 * (1 - reveal);
        grad.addColorStop(0, `rgba(${COLOR_INFRA},0)`);
        grad.addColorStop(0.5, `rgba(150,190,255,${a})`);
        grad.addColorStop(1, `rgba(${COLOR_INFRA},0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(waveX - 70, h * 0.22, 140, h * 0.62);
      }

      // Packets
      packets = packets.filter((pk) => pk.t >= 0 && pk.t <= 1);
      for (const pk of packets) {
        const [ai, bi] = synapses[pk.syn];
        const A = nodes[ai];
        const B = nodes[bi];
        const revLine = Math.min(colReveal(A.col, reveal), colReveal(B.col, reveal)) * nv;
        const x = lx[ai] + (lx[bi] - lx[ai]) * pk.t;
        const y = ly[ai] + (ly[bi] - ly[ai]) * pk.t;
        const touches = hover !== null && (A.id === hover || B.id === hover);
        const alpha = pk.flow
          ? (0.4 + 0.6 * iso) * revLine
          : (pk.dir === 1 ? 0.7 : 0.4) * revLine * (hover ? (touches ? 0.6 : 0.12) : 1);
        if (alpha > 0.02) {
          const r = pk.flow ? 6.5 : 5;
          const g2 = ctx!.createRadialGradient(x, y, 0, x, y, r);
          g2.addColorStop(0, `rgba(${COLOR_INFRA},${alpha})`);
          g2.addColorStop(1, `rgba(${COLOR_INFRA},0)`);
          ctx!.fillStyle = g2;
          ctx!.beginPath();
          ctx!.arc(x, y, r, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = `rgba(${pk.flow ? "210,230,255" : "150,190,255"},${alpha})`;
          ctx!.beginPath();
          ctx!.arc(x, y, pk.flow ? 1.9 : 1.5, 0, Math.PI * 2);
          ctx!.fill();
        }
        pk.t += pk.speed * pk.dir;
      }

      if (reveal > 0.5) {
        idleAccum += gsap.ticker.deltaRatio();
        if (packets.filter((pk) => !pk.flow).length < 9 && idleAccum > 6) {
          idleAccum = 0;
          spawnIdle();
        }
      }
      if (hover) {
        flowAccum += gsap.ticker.deltaRatio();
        if (flowAccum > 2.4) {
          flowAccum = 0;
          spawnFlow(hover);
        }
      }
    }

    let running = false;
    const start = () => {
      if (running || !isInteractive) return;
      running = true;
      gsap.ticker.add(render);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      gsap.ticker.remove(render);
    };

    // The self-playing boot: loader on an empty canvas → ignite → top chip.
    function playBoot() {
      bootTl?.kill();
      const obj = { reveal: 0 };
      bootRevealRef.current = 0;
      bootTl = gsap.timeline();
      bootTl
        .set(loaderRef.current, { opacity: 0, scale: 1, y: 0 })
        .set(barRef.current, { scaleX: 0 })
        .to(loaderRef.current, { opacity: 1, duration: 0.3, ease: "power1.out" })
        .to(barRef.current, { scaleX: 1, duration: 1.0, ease: "power1.inOut" }, "<")
        .to(
          obj,
          {
            reveal: 1,
            duration: 0.95,
            ease: "power2.out",
            onUpdate: () => {
              bootRevealRef.current = obj.reveal;
            },
          },
          "+=0.15",
        )
        .to(loaderRef.current, { opacity: 0, scale: 0.5, y: -h * 0.42, duration: 0.7, ease: "power2.in" }, "<")
        .to(chipRef.current, { opacity: 1, duration: 0.45, ease: "power1.out" }, "-=0.35")
        .call(() => {
          bootRevealRef.current = 1;
          bootedRef.current = true;
          // First hint ~1.5s after boot (so users notice), then every ~3.5s.
          setTimeout(() => fireDemoRef.current(), 1500);
          if (demoTimerRef.current) clearInterval(demoTimerRef.current);
          demoTimerRef.current = setInterval(() => {
            if (hasInteractedRef.current) {
              if (demoTimerRef.current) clearInterval(demoTimerRef.current);
              return;
            }
            fireDemoRef.current();
          }, DEMO_EVERY);
        });
    }

    let gsapCtx: gsap.Context | null = null;
    function setupScroll() {
      gsap.registerPlugin(ScrollTrigger);
      gsapCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: scene!,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const p = self.progress;
            progressRef.current = p;
            const heroP = clamp(1 - p / HERO_FADE_END, 0, 1);
            if (heroRef.current)
              gsap.set(heroRef.current, { opacity: heroP, y: (1 - heroP) * -32, pointerEvents: heroP < 0.05 ? "none" : "auto" });
            // Net visibility: hide the whole network + chip when scrolled back to the hero.
            const netVis = clamp((p - 0.16) / 0.07, 0, 1);
            netVisRef.current = netVis;
            if (bootedRef.current && chipRef.current) gsap.set(chipRef.current, { opacity: netVis });
            if (netVis < 0.5 && demoIdRef.current) {
              demoIdRef.current = null;
              setDemoId(null);
            }
            if (!bootStartedRef.current && p > BOOT_TRIGGER && p < 0.95) {
              bootStartedRef.current = true;
              playBoot();
            }
            if (p < 0.15 && engineHoverRef.current) {
              overNodeRef.current = false;
              overCardRef.current = false;
              clearActive();
            }
          },
        });
      }, scene!);
    }
    function resetOverlays() {
      if (heroRef.current) gsap.set(heroRef.current, { opacity: 1, y: 0, pointerEvents: "auto" });
    }
    function showBootedInstant() {
      // already booted before a resize: keep the network live, skip the animation
      bootRevealRef.current = 1;
      bootedRef.current = true;
      if (loaderRef.current) gsap.set(loaderRef.current, { opacity: 0 });
      if (chipRef.current) gsap.set(chipRef.current, { opacity: 1 });
    }

    function applyMode() {
      reduce = mq("(prefers-reduced-motion: reduce)").matches;
      isMobile = w < MOBILE_BP;
      const next = finePointer && !reduce && !isMobile;
      isInteractive = next;
      setInteractive(next);
    }
    function init() {
      resize();
      applyMode();
      if (isInteractive) {
        if (bootStartedRef.current) showBootedInstant();
        setupScroll();
        start();
      } else {
        progressRef.current = 1;
        resetOverlays();
        ctx!.clearRect(0, 0, w, h);
      }
    }
    init();

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        if (!isInteractive) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.inside = pointer.x >= 0 && pointer.x <= w && pointer.y >= 0 && pointer.y <= h;
    };
    const onPointerLeaveWin = () => {
      pointer.inside = false;
    };
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeaveWin);
    }

    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        stop();
        gsapCtx?.revert();
        gsapCtx = null;
        overNodeRef.current = false;
        overCardRef.current = false;
        clearActive();
        resize();
        applyMode();
        if (isInteractive) {
          if (bootStartedRef.current) showBootedInstant();
          setupScroll();
          start();
        } else {
          progressRef.current = 1;
          resetOverlays();
          ctx!.clearRect(0, 0, w, h);
        }
      });
    });
    ro.observe(canvas);

    const motionMq = mq("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      stop();
      gsapCtx?.revert();
      gsapCtx = null;
      clearActive();
      applyMode();
      if (isInteractive) {
        if (bootStartedRef.current) showBootedInstant();
        setupScroll();
        start();
      } else {
        progressRef.current = 1;
        resetOverlays();
        ctx!.clearRect(0, 0, w, h);
      }
    };
    motionMq.addEventListener?.("change", onMotionChange);

    return () => {
      stop();
      bootTl?.kill();
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(resizeRaf);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      if (demoHideRef.current) clearTimeout(demoHideRef.current);
      if (demoTimerRef.current) clearInterval(demoTimerRef.current);
      gsapCtx?.revert();
      motionMq.removeEventListener?.("change", onMotionChange);
      if (finePointer) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeaveWin);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearActive]);

  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const activeNode = activeId && layout ? layout.nodes.find((n) => n.id === activeId) ?? null : null;
  const cardData = activeId ? ALL_NODES.find((n) => n.id === activeId) ?? null : null;
  const cardRight = activeNode ? activeNode.x < vw * 0.6 : true;
  const demoNode = demoId && layout ? layout.nodes.find((n) => n.id === demoId) ?? null : null;

  return (
    <>
      <section
        ref={sceneRef}
        aria-label="Skills and projects pipeline"
        className="relative"
        style={interactive ? { height: `calc(100svh * ${SCENE_VH})` } : undefined}
      >
        <div ref={stageRef} className="min-h-hero sticky top-0 overflow-hidden">
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 z-0 h-full w-full" />

          <div ref={heroRef} className="absolute inset-0 z-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-bg/70 to-transparent"
            />
            <Hero />
          </div>

          {interactive && layout && (
            <>
              {/* Neuron tokens (transform set imperatively per frame for drift/magnetism) */}
              {layout.nodes.map((n) => {
                const st: TokenState = !activeNode
                  ? "rest"
                  : n.id === activeNode.id
                    ? "active"
                    : Math.abs(n.col - activeNode.col) === 1
                      ? "related"
                      : "dimmed";
                return (
                  <div
                    key={n.id}
                    ref={(el) => {
                      tokenRefs.current[n.id] = el;
                    }}
                    className="absolute z-10"
                    style={{ left: n.x, top: n.y, opacity: `var(--rev-${n.col}, 0)` }}
                  >
                    <NodeToken
                      node={n}
                      size={n.isCore ? Math.round(layout.size * 1.3) : layout.size}
                      state={st}
                      isCore={n.isCore}
                      demo={n.id === demoId}
                      onHoverStart={() => activate(n.id)}
                      onHoverEnd={onNodeLeave}
                    />
                  </div>
                );
              })}

              {/* "hover to inspect" hint */}
              {demoNode && (
                <div
                  className="pointer-events-none absolute z-30 -translate-x-1/2"
                  style={{
                    left: demoNode.x,
                    top: demoNode.y + (demoNode.isCore ? layout.size * 1.3 : layout.size) / 2 + 12,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="whitespace-nowrap rounded-md border border-border-soft bg-surface/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink backdrop-blur-sm"
                  >
                    hover to inspect
                  </motion.div>
                </div>
              )}

              {/* Boot loader (empty canvas → converges up into the chip) */}
              <div className="pointer-events-none absolute left-1/2 top-[50%] z-30 -translate-x-1/2">
                <div ref={loaderRef} className="flex flex-col items-center gap-3 opacity-0">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                    Initializing inference engine
                  </span>
                  <div className="h-px w-44 overflow-hidden bg-hairline">
                    <div ref={barRef} className="h-full w-full origin-left bg-infra" style={{ transform: "scaleX(0)" }} />
                  </div>
                </div>
              </div>

              {/* Live status chip (top) */}
              <div
                ref={chipRef}
                className="pointer-events-none absolute left-1/2 top-[5%] z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-soft bg-surface/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-muted opacity-0 backdrop-blur-sm"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full bg-live"
                    animate={{ scale: [1, 1.7], opacity: [0.32, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                Inference: live
              </div>

              {/* Column monikers */}
              {LAYERS.map((l, i) => {
                const isResult = i === LAYERS.length - 1;
                if (layout.cols.length !== LAYERS.length) return null;
                return (
                  <div
                    key={l.index}
                    ref={(el) => {
                      monikerRefs.current[i] = el;
                    }}
                    className={`pointer-events-none absolute top-[16%] z-10 font-mono uppercase leading-snug tracking-wider opacity-0 ${
                      isResult ? "text-right" : "-translate-x-1/2 text-center"
                    }`}
                    style={isResult ? { right: layout.cols[0], maxWidth: 150 } : { left: layout.cols[i], maxWidth: 120 }}
                  >
                    <span className="block text-[11px] font-semibold tracking-wide text-infra/80">
                      {l.keyword}
                    </span>
                  </div>
                );
              })}

              {/* Detail card */}
              {activeNode && cardData && (
                <div
                  className="pointer-events-none absolute z-40"
                  style={{
                    left: activeNode.x,
                    top: clamp(activeNode.y, 190, vh - 190),
                    transform: cardRight ? "translate(34px, -50%)" : "translate(calc(-100% - 34px), -50%)",
                  }}
                >
                  <DetailCard node={cardData} onChipClick={onChipClick} onPointerEnter={onCardEnter} onPointerLeave={onCardLeave} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <PipelineContent variant={interactive ? "a11y" : "visible"} />
    </>
  );
}
