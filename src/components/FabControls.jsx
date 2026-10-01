/**
 * FabControls — the single floating action button for the page.
 *
 * One control in the bottom-right corner: scroll-to-top. The site is
 * dark-only by design, so there is no theme toggle to sit beside it.
 */
import { usePrefersReducedMotion, useScrolledPast } from "../hooks";
import Icon from "./Icon";

export default function FabControls() {
  const visible = useScrolledPast(500);
  const reduced = usePrefersReducedMotion();

  return (
    <button
      type="button"
      className={`fab${visible ? " fab--visible" : ""}`}
      aria-label="Scroll back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
      }
    >
      <Icon name="arrowUp" size={18} strokeWidth={2.2} aria-hidden="true" />
    </button>
  );
}
