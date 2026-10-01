/**
 * Portfolio mode context and consumer hook.
 *
 * The site has two professional modes (web developer, video editor). The
 * matching mode object comes from src/config.js and is provided by
 * <PortfolioProvider> (see ./PortfolioProvider.jsx). Any section component
 * reads it through usePortfolio().
 *
 * This file is deliberately a plain .js module - it exports a hook, not a
 * component, so the provider stays the only export of its own .jsx file and
 * Fast Refresh keeps working during development.
 */
import { createContext, useContext } from "react";

export const PortfolioContext = createContext(null);

export function usePortfolio() {
  const mode = useContext(PortfolioContext);
  if (!mode) {
    throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  }
  return mode;
}