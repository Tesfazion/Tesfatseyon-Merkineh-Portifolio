/**
 * main.jsx — entry point.
 *
 * The site is dark-only: there is no theme switching, so React mounts
 * straight away. The `.js` class is added synchronously because the
 * reveal-on-scroll animation hides content until it enters the viewport —
 * it must only ever apply when JS can switch it back on, otherwise a
 * script failure would leave a blank page.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

document.documentElement.classList.add("js");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);