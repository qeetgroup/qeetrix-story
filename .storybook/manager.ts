import { addons } from "storybook/manager-api";

import { qeetrixTheme } from "./theme";

/**
 * Brands the Storybook workshop chrome with the shared Qeetrix theme (see theme.ts)
 * and — unlike stock Storybook, where the sidebar/toolbars are themed once and stay
 * put — keeps the chrome in lockstep with the preview's Theme toggle.
 *
 * Storybook applies the manager theme once at boot and `addons.setConfig({ theme })`
 * does NOT hot-swap a mounted manager, so we can't follow the toggle by swapping
 * theme objects. Instead we toggle a `.qx-chrome-dark` class on the manager document
 * (manager-head.html restyles the sidebar/toolbars under it).
 *
 * We drive that from the top-window URL, which Storybook keeps in sync with the
 * `theme` toolbar global (`…&globals=theme:dark`). Polling the URL is deliberately
 * event-free: the manager's global/story events proved unreliable to subscribe to
 * from here, whereas the URL is always authoritative. A 200ms tick is imperceptible
 * for a theme flip and costs nothing.
 *
 * The brand mark is the Qeet SVG staged in ./public (the manager renders outside the
 * preview iframe and can't mount a React component); brand fonts load via
 * manager-head.html.
 */
addons.setConfig({ theme: qeetrixTheme });

if (typeof window !== "undefined") {
  const syncChromeTheme = () => {
    const isDark = /theme(?:%3A|:)dark/.test(window.location.href);
    document.body.classList.toggle("qx-chrome-dark", isDark);
  };
  syncChromeTheme();
  window.setInterval(syncChromeTheme, 200);
}
