"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getAnchors } from "./anchorStore";

/**
 * The lime "me" node threading the whole page.
 *
 * Reads the live screen position of every registered anchor each frame (network result
 * node, projects orbit core, experience "now" head + spine-bottom waypoint, contact node),
 * orders them top→bottom, and rides the traveling dot along that polyline by scroll. A
 * faint screen-blend comet trail follows. When the user stops scrolling the dot dissolves
 * into the nearest dock anchor (so only that section's own lime dot remains) and fires a
 * one-shot bloom; it re-emerges and travels on the next scroll.
 *
 * Disabled under prefers-reduced-motion and below lg — the per-section lime dots remain as
 * the static fallback.
 */

const TRAIL = 6;

export default function LimeThread() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [bloom, setBloom] = useState<{ x: number; y: number; key: number } | null>(null);

  const dotRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const st = useRef({
    x: 0,
    y: 0,
    op: 0,
    trail: Array.from({ length: TRAIL }, () => ({ x: 0, y: 0 })),
    lastScrollY: -1,
    lastMoveT: 0,
    wasIdle: true,
    primed: false,
    dir: 1,
  });

  // Enable only on lg+ and when motion is allowed.
  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let sleeping = false;
    const s = st.current;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const anchors = getAnchors();
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // idle = scroll position stopped changing (ignores momentum/settle events at same Y)
      if (s.lastScrollY < 0) s.lastScrollY = scrollY;
      if (Math.abs(scrollY - s.lastScrollY) > 0.5) {
        s.lastMoveT = now;
        s.dir = scrollY < s.lastScrollY ? -1 : 1; // sticky: held through brief scroll pauses
      }
      s.lastScrollY = scrollY;
      const goingUp = s.dir < 0;
      const idle = now - s.lastMoveT > 150;

      if (anchors.length < 2) {
        if (dotRef.current) dotRef.current.style.opacity = "0";
        return;
      }

      // the live track marker (the experience trace tip), pulled out before the map
      let track: { vpx: number; vpy: number; onScreen: boolean } | null = null;
      const trackAnchor = anchors.find((a) => a.meta.track);
      if (trackAnchor) {
        const r = trackAnchor.el.getBoundingClientRect();
        track = {
          vpx: r.left + r.width / 2,
          vpy: r.top + r.height / 2,
          onScreen: r.top > 4 && r.top < vh - 4,
        };
      }

      // dock stations (top→bottom)
      const stations = anchors
        .filter((a) => !a.meta.track)
        .map((a) => {
          const r = a.el.getBoundingClientRect();
          const docCenterY = r.top + scrollY + r.height / 2;
          return {
            dock: a.meta.dock !== false,
            docCenterY,
            vpx: r.left + r.width / 2,
            vpy: r.top + r.height / 2,
            dockScroll: docCenterY - vh / 2,
          };
        })
        .sort((p, q) => p.docCenterY - q.docCenterY);

      if (stations.length < 1) {
        if (dotRef.current) dotRef.current.style.opacity = "0";
        return;
      }

      // nearest dock (for the end-snap + bloom)
      const docks = stations.filter((x) => x.dock);
      let nd = docks[0] ?? stations[0];
      let best = Infinity;
      for (const d of docks) {
        const dd = Math.abs(scrollY - d.dockScroll);
        if (dd < best) {
          best = dd;
          nd = d;
        }
      }

      // Final leg DOWN (experience → contact): hand off the tip early so the dot center-glides
      // into the contact node over a long runway, instead of rushing across at the very end.
      // Only while descending — going back up we want the tip (left spine) re-grabbed straight away.
      const contactDock = docks[docks.length - 1];
      const approachingContact =
        !goingUp &&
        !!contactDock &&
        contactDock === nd &&
        scrollY > contactDock.dockScroll - vh * 0.85;

      // Engage the experience tip. Descending: only once it has risen into the upper screen, so it
      // doesn't yank the dot to the bottom edge as the section scrolls in. Ascending: the moment the
      // tip is on screen, so the dot glides left onto the spine tip instead of rejoining mid-spine.
      const onTip =
        !!track && track.onScreen && (goingUp || track.vpy < vh * 0.55) && !approachingContact;

      let tx: number, ty: number;
      if (onTip) {
        tx = track!.vpx;
        ty = track!.vpy;
      } else {
        // center-glide: interpolate the target in DOCUMENT space then convert to viewport,
        // so the dot stays at screen-center and slides to the next dot's column (no diving)
        const first = stations[0];
        const last = stations[stations.length - 1];
        if (scrollY <= first.dockScroll) {
          tx = first.vpx;
          ty = first.docCenterY - scrollY;
        } else if (scrollY >= last.dockScroll) {
          tx = last.vpx;
          ty = last.docCenterY - scrollY;
        } else {
          let i = 0;
          while (
            i < stations.length - 1 &&
            !(scrollY >= stations[i].dockScroll && scrollY < stations[i + 1].dockScroll)
          )
            i++;
          const a = stations[i];
          const b = stations[i + 1];
          const t = (scrollY - a.dockScroll) / Math.max(1, b.dockScroll - a.dockScroll);
          tx = a.vpx + (b.vpx - a.vpx) * t;
          ty = a.docCenterY + (b.docCenterY - a.docCenterY) * t - scrollY;
        }
      }

      // when stopped: fade in place — unless the dot is almost on a dot, then snap onto it
      let snapped = false;
      if (idle) {
        const dist = Math.hypot(s.x - nd.vpx, s.y - nd.vpy);
        if (dist < 70) {
          tx = nd.vpx;
          ty = nd.vpy;
          snapped = true;
        } else {
          tx = s.x;
          ty = s.y;
        }
      }

      // soft glide (snap to target on the first frame only). Gentler eases for the two long moves:
      // descending into the contact node, and re-grabbing the left spine tip on the way back up.
      const k = s.primed
        ? approachingContact
          ? 0.1
          : goingUp && onTip
            ? 0.085
            : 0.14
        : 1;
      s.x += (tx - s.x) * k;
      s.y += (ty - s.y) * k;
      s.primed = true;

      // visible the whole way; gently fades when stopped
      const opTarget = idle ? 0 : 0.82;
      s.op += (opTarget - s.op) * 0.1;

      // bloom once, only when it actually settled onto a dot
      if (idle && !s.wasIdle && snapped && nd) setBloom({ x: nd.vpx, y: nd.vpy, key: now });
      s.wasIdle = idle;

      // comet trail follow chain
      let px = s.x;
      let py = s.y;
      for (let j = 0; j < TRAIL; j++) {
        const tn = s.trail[j];
        tn.x += (px - tn.x) * 0.35;
        tn.y += (py - tn.y) * 0.35;
        px = tn.x;
        py = tn.y;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%)`;
        dotRef.current.style.opacity = String(s.op);
      }
      for (let j = 0; j < TRAIL; j++) {
        const el = trailRefs.current[j];
        if (!el) continue;
        const tn = s.trail[j];
        const fade = s.op * (1 - (j + 1) / (TRAIL + 1)) * 0.6;
        el.style.transform = `translate3d(${tn.x}px, ${tn.y}px, 0) translate(-50%, -50%)`;
        el.style.opacity = String(fade);
      }

      // Fully idle + faded out → stop the loop; the scroll listener wakes it.
      if (idle && s.op < 0.008) {
        cancelAnimationFrame(raf);
        sleeping = true;
      }
    };

    const wake = () => {
      if (!sleeping) return;
      sleeping = false;
      s.lastMoveT = performance.now();
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", wake, { passive: true });

    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("scroll", wake);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (reduce || !enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
      style={{ mixBlendMode: "screen" }}
    >
      {Array.from({ length: TRAIL }).map((_, j) => (
        <span
          key={j}
          ref={(el) => {
            trailRefs.current[j] = el;
          }}
          className="absolute left-0 top-0 rounded-full bg-live blur-[1px]"
          style={{ width: 8 - j, height: 8 - j, opacity: 0 }}
        />
      ))}
      <span
        ref={dotRef}
        className="absolute left-0 top-0 h-3 w-3 rounded-full bg-live shadow-[0_0_14px_4px_rgba(204,255,0,0.55)]"
        style={{ opacity: 0 }}
      />
      <AnimatePresence>
        {bloom && (
          <span
            key={bloom.key}
            className="absolute left-0 top-0"
            style={{ transform: `translate3d(${bloom.x}px, ${bloom.y}px, 0)` }}
          >
            <motion.span
              initial={{ scale: 0.4, opacity: 0.5 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => setBloom(null)}
              className="-ml-6 -mt-6 block h-12 w-12 rounded-full border border-live/50"
            />
          </span>
        )}
      </AnimatePresence>
    </div>
  );
}
