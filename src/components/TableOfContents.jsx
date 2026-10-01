/**
 * TableOfContents — generated from the post's own headings.
 *
 * Scroll-spy is done by observing the headings, not by comparing
 * scroll offsets, so it stays correct when the viewport resizes, when a
 * font loads late and reflows the page, or when mobile browser chrome
 * collapses and changes the visible height.
 */
import { useEffect, useRef } from "react";
import { scrollToId } from "../hooks";

export function TableOfContents({ headings = [], activeId, onNavigate }) {
  const listRef = useRef(null);

  /* Keep the active entry visible as the reader scrolls a long list. */
  useEffect(() => {
    if (!activeId) return;
    listRef.current
      ?.querySelector(`[data-toc-id="${CSS.escape(activeId)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  if (headings.length < 2) return null;

  return (
    <aside className="toc" aria-label="On this page">
      <span className="toc-kicker">On this page</span>
      <ol className="toc-list" ref={listRef}>
        {headings.map((h) => (
          <li key={h.id} className={`toc-item toc-item--d${h.depth}`}>
            <a
              href={`#${h.id}`}
              data-toc-id={h.id}
              aria-current={activeId === h.id ? "location" : undefined}
              className={activeId === h.id ? "is-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(h.id);
                onNavigate?.();
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
