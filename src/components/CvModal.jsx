/**
 * CvModal — near-fullscreen preview of the résumé PDF.
 *
 * Closes on Escape or overlay click, traps focus while open, and returns
 * focus to whatever opened it. The header keeps a Download link for when
 * someone actually wants the file rather than a preview.
 */
import { useEffect, useRef } from "react";
import { useFocusTrap } from "../hooks";
import Icon from "./Icon";

export default function CvModal({ url, name, onClose }) {
  const panelRef = useRef(null);
  useFocusTrap(true, panelRef, onClose);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      className="cv-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Résumé preview"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="cv-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cv-modal-head">
          <span className="cv-modal-title">{name}</span>
          <a href={url} className="btn btn-sm" download={name}>
            <Icon name="download" size={14} /> Download
          </a>
          <button
            type="button"
            className="cv-modal-close"
            onClick={onClose}
            aria-label="Close résumé preview"
          >
            <Icon name="close" size={18} />
          </button>
        </header>
        <iframe className="cv-modal-frame" src={url} title="Résumé preview" />
      </div>
    </div>
  );
}
