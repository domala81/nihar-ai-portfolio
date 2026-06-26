/**
 * Tiny module-level registry for the lime "me" thread.
 *
 * Each section registers its lime anchor element (the network result node, the projects
 * orbit core, the experience "now" head, the contact node) plus optional path waypoints.
 * `LimeThread` subscribes, reads every anchor's live position each frame, and routes the
 * traveling dot between them. No React context / provider wiring — import and call.
 */

export type AnchorMeta = {
  /** the traveler can dock + bloom here (a real lime dot). Waypoints (false) only guide the path. */
  dock?: boolean;
  /** a live moving marker the traveler follows directly while on screen (e.g. the experience trace tip). */
  track?: boolean;
};

export type Anchor = { id: string; el: HTMLElement; meta: AnchorMeta };

const anchors = new Map<string, Anchor>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

/** Register an anchor; returns an unregister cleanup for useEffect. */
export function registerAnchor(
  id: string,
  el: HTMLElement,
  meta: AnchorMeta = { dock: true },
): () => void {
  anchors.set(id, { id, el, meta });
  emit();
  return () => {
    if (anchors.get(id)?.el === el) {
      anchors.delete(id);
      emit();
    }
  };
}

export function getAnchors(): Anchor[] {
  return Array.from(anchors.values());
}

export function subscribeAnchors(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
