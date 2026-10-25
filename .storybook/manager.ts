import { createElement } from "react";
import { addons } from "storybook/manager-api";

import { qeetrixThemeDark, qeetrixThemeLight } from "./theme";

/** The Theme global, from the URL Storybook keeps in sync with it (`…&globals=theme:dark`). */
const isDark = () =>
  typeof window !== "undefined" && /theme(?:%3A|:)dark/.test(window.location.href);

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
type Entry = { type: string; name: string; tags?: string[]; children?: string[] };
type Api = { getData?: (id: string) => Entry | undefined };

/** A component's tags, or its first story's when the index doesn't roll them up to it. */
const tagsOf = (item: Entry, api?: Api) =>
  item.tags?.length
    ? item.tags
    : (item.children?.[0] && api?.getData?.(item.children[0])?.tags) || [];

addons.setConfig({
  // Boot in the scheme the page opens in; live toggles restyle through `.qx-chrome-dark`.
  theme: isDark() ? qeetrixThemeDark : qeetrixThemeLight,
  sidebar: {
    // Experimental components (`@qeetrix/react/experimental`, tagged `experimental`) carry a
    // pill in the sidebar, the way enterprise systems flag a component's status where you
    // pick it, not only on its page.
    renderLabel: (item: Entry, api?: Api) => {
      if (item.type !== "component" || !tagsOf(item, api).includes("experimental"))
        return item.name;
      return createElement(
        "span",
        { className: "qx-sidebar-label" },
        item.name,
        createElement(
          "span",
          {
            className: "qx-sidebar-badge",
            title: "Experimental: from @qeetrix/react/experimental",
          },
          "Exp",
        ),
      );
    },
  },
});

if (typeof window !== "undefined") {
  const syncChromeTheme = () => document.body.classList.toggle("qx-chrome-dark", isDark());
  syncChromeTheme();
  window.setInterval(syncChromeTheme, 200);
}
