/**
 * PaletteTrigger — the "Search ⌘K" button.
 *
 * Rendered inside whichever header is on screen (the portfolio navbar
 * and the landing header are separate components) while the palette
 * itself lives once in App. State comes from lib/palette.js.
 */
import Icon from "./Icon";
import { openPalette } from "../lib/palette";

export default function PaletteTrigger() {
  return (
    <button
      type="button"
      className="palette-trigger"
      onClick={openPalette}
      aria-label="Search the site"
      aria-keyshortcuts="Control+K Meta+K"
      title="Search (Ctrl/⌘ + K)"
    >
      <Icon name="search" size={15} />
      <span>Search</span>
      <kbd>⌘K</kbd>
    </button>
  );
}
