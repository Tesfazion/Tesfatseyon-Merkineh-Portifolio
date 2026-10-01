/**
 * StickyCTA — a persistent "Hire me" that appears once the visitor has
 * scrolled past the hero, so the primary action is always one tap away
 * without competing with the hero buttons on arrival.
 */
import { socials } from "../config";
import { useScrolledPast } from "../hooks";
import Icon from "./Icon";

export default function StickyCTA() {
  const visible = useScrolledPast(600);

  return (
    <a
      href={socials.telegram}
      className={`sticky-cta${visible ? " sticky-cta--visible" : ""}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hire me on Telegram"
      // Hidden means untabbable: an off-screen focusable link is a trap
      // for anyone navigating by keyboard.
      tabIndex={visible ? 0 : -1}
    >
      <Icon name="telegram" size={15} />
      Hire Me
    </a>
  );
}
