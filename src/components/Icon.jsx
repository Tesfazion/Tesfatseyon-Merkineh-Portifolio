const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

const Icons = {
  search: (p) => (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  copy: (p) => (
    <svg {...base} {...p}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  clock: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  ),
  calendar: (p) => (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="3" y1="11" x2="21" y2="11" />
    </svg>
  ),
  arrowUpRight: (p) => (
    <svg {...base} {...p}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  code: (p) => (
    <svg {...base} {...p}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  video: (p) => (
    <svg {...base} {...p}>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <polygon points="16,10 22,6 22,18 16,14" />
    </svg>
  ),
  palette: (p) => (
    <svg {...base} {...p}>
      <path d="M12 2a10 10 0 1 0 0 20 2.5 2.5 0 0 0 2.5-2.5c0-.9-.5-1.5-.5-2.5a2.5 2.5 0 0 1 2.5-2.5H17a5 5 0 0 0 5-5c0-4.1-4.5-7.5-10-7.5z" />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  layout: (p) => (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="9" x2="9" y2="21" />
    </svg>
  ),
  sparkle: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg {...base} {...p}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  arrowLeft: (p) => (
    <svg {...base} {...p}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  arrowDown: (p) => (
    <svg {...base} {...p}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  mail: (p) => (
    <svg {...base} {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (p) => (
    <svg {...base} {...p}>
      <path d="M15.5 21C8.6 21 3 15.4 3 8.5V6a2 2 0 0 1 2-2h2.4a1 1 0 0 1 .97.76l.9 3.6a1 1 0 0 1-.45 1.08L6.9 10.5a12.5 12.5 0 0 0 6.6 6.6l1.06-.92a1 1 0 0 1 1.08-.45l3.6.9a1 1 0 0 1 .76.97V20a2 2 0 0 1-2 2z" />
    </svg>
  ),
  arrowUp: (p) => (
    <svg {...base} {...p}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  github: (p) => (
    <svg {...base} {...p}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.4 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  ),
  linkedin: (p) => (
    <svg {...base} {...p}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2a6 6 0 0 1 2-2z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  instagram: (p) => (
    <svg {...base} {...p}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  telegram: (p) => (
    <svg {...base} {...p} fill="currentColor" stroke="none">
      <path d="M22 2.9L1.7 9.6c-1.7.7-1.7 1.6-.3 2l5.2 1.6 2 6.2c.2.6.7.7 1.2.4l2.9-2.2 5.3 3.9c1 .5 1.7.2 2-1L24 4.2c.3-1.3-.5-2-1.9-1.3zM7.6 13.4l10.2-6.5c.5-.3.9.2.5.6l-8.4 7.6-.3 3.2-2-4.9z" />
    </svg>
  ),
  x: (p) => (
    <svg {...base} {...p} fill="currentColor" stroke="none">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23z" />
    </svg>
  ),
  download: (p) => (
    <svg {...base} {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  external: (p) => (
    <svg {...base} {...p}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  menu: (p) => (
    <svg {...base} {...p}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (p) => (
    <svg {...base} {...p}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  check: (p) => (
    <svg {...base} {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  chevronLeft: (p) => (
    <svg {...base} {...p}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronRight: (p) => (
    <svg {...base} {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  send: (p) => (
    <svg {...base} {...p}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  briefcase: (p) => (
    <svg {...base} {...p}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  eye: (p) => (
    <svg {...base} {...p}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  zap: (p) => (
    <svg {...base} {...p}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  monitor: (p) => (
    <svg {...base} {...p}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
};

/**
 * Icon — inline SVG lookup.
 *
 * `name` falls back to the code glyph so a typo degrades to a visible
 * placeholder instead of an empty slot, and any extra prop (style, title,
 * data-*) is forwarded so callers can tint or label the svg directly rather
 * than wrapping it.
 */
export default function Icon({
  name,
  size = 24,
  className = "",
  strokeWidth,
  ...rest
}) {
  const Cmp = Icons[name] || Icons.code;
  return (
    <Cmp
      width={size}
      height={size}
      className={className}
      strokeWidth={strokeWidth || base.strokeWidth}
      {...rest}
    />
  );
}
