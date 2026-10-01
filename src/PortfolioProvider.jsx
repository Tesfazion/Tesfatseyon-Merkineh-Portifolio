/**
 * PortfolioProvider - selects the active mode and makes it available to
 * every section component through usePortfolio() from ./PortfolioContext.
 *
 * The mode key comes from the route: /web resolves to modes.web and /video
 * to modes.video, with a safe fallback to the web mode for anything else.
 */
import { PortfolioContext } from "./PortfolioContext";
import { modes } from "./config";

export function PortfolioProvider({ modeKey, children }) {
  const mode = modes[modeKey] || modes.web;
  return (
    <PortfolioContext.Provider value={mode}>{children}</PortfolioContext.Provider>
  );
}