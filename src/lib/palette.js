/**
 * Command-palette open state, shared across the tree.
 *
 * The palette itself is mounted once in App so the ⌘K shortcut works on
 * every route, but its trigger belongs in the header -- and the two
 * headers (the portfolio navbar and the separate landing header) are
 * different components. Prop-drilling through both, or reaching for a
 * DOM event, would be worse than a three-line external store, so this
 * is a `useSyncExternalStore` source instead of React context: it has no
 * provider, and a trigger rendered anywhere can open the palette.
 */

let isOpen = false;
const listeners = new Set();

const emit = () => listeners.forEach((fn) => fn());

export function subscribePalette(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getPaletteOpen() {
  return isOpen;
}

function setPaletteOpen(next) {
  const value = typeof next === "function" ? next(isOpen) : next;
  if (value === isOpen) return;
  isOpen = value;
  emit();
}

export const openPalette = () => setPaletteOpen(true);
export const closePalette = () => setPaletteOpen(false);
export const togglePalette = () => setPaletteOpen((v) => !v);
