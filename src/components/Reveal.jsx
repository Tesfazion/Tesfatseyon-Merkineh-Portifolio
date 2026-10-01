/**
 * Reveal — scroll-triggered fade-up wrapper.
 *
 * Forwards className, style, and delay to the root div, plus any extra
 * prop (id, aria-*, data-*, onClick) verbatim. Without the rest spread those
 * props were silently dropped — which is how the tech marquee's
 * `aria-hidden="true"` never made it to the DOM.
 */
import { useInView } from "../hooks";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  style,
  ...rest
}) {
  const [ref, inView] = useInView(0.12);

  return (
    <div
      {...rest}
      ref={ref}
      className={`reveal${inView ? " reveal-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}
