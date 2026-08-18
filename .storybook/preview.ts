import type { Preview } from "@storybook/react-vite";
import { addons } from "storybook/preview-api";

import { qeetrixTheme } from "./theme";
import "./styles.css";

/**
 * Drives light/dark via the `.dark` class on <html> — the same class strategy
 * the Qeetrix ThemeProvider uses in production, so stories look identical to apps.
 *
 * A decorator alone only runs when a *story* renders, which leaves pure-MDX pages
 * (e.g. Foundations → Introduction, which has live components but no story exports)
 * stuck on the initial theme. So we also toggle the class straight from the preview
 * channel: `setGlobals` on first load and `globalsUpdated` on every toolbar change.
 * That covers canvas, autodocs, and MDX uniformly — they all share this one iframe,
 * whose `:root`/`.dark` variables come from @qeetrix/ui/styles.css.
 */
const applyTheme = (theme?: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
};

const applyDensity = (density?: string) => {
  if (typeof document === "undefined") return;
  if (density === "comfortable" || density === "compact") {
    document.documentElement.setAttribute("data-qx-density", density);
  } else {
    document.documentElement.removeAttribute("data-qx-density");
  }
};

const applyGlobals = (globals?: { theme?: string; density?: string }) => {
  applyTheme(globals?.theme);
  applyDensity(globals?.density);
};

try {
  const channel = addons.getChannel();
  channel.on("setGlobals", ({ globals }: { globals?: { theme?: string; density?: string } }) =>
    applyGlobals(globals),
  );
  channel.on("globalsUpdated", ({ globals }: { globals?: { theme?: string; density?: string } }) =>
    applyGlobals(globals),
  );
} catch {
  // Channel not ready (or unavailable in this context); the decorator below still
  // syncs the class on story renders.
}
const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    layout: "centered",
    // Autodocs pages adopt the shared brand theme (typography + accent) so the
    // docs read as Qeet product docs, not stock Storybook.
    docs: { theme: qeetrixTheme },
    a11y: {
      // A story renders a single component into #storybook-root — not a full
      // document — so axe's "region" rule (every bit of page content must sit
      // inside a landmark like <main>/<nav>) is a false positive here: that's
      // the app shell's responsibility, not a primitive's. Left on, it flags
      // ~85 violations across nearly every story and drowns out the real ones.
      options: { rules: { region: { enabled: false } } },
    },
  },
  globalTypes: {
    theme: {
      description: "Light / dark",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Legacy / comfortable / compact",
      defaultValue: "legacy",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "legacy", title: "Legacy" },
          { value: "comfortable", title: "Comfortable" },
          { value: "compact", title: "Compact" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      // First-paint sync for story renders (the channel listeners handle MDX +
      // subsequent toolbar changes).
      applyGlobals({
        theme: (ctx.globals as { theme?: string }).theme ?? "light",
        density: (ctx.globals as { density?: string }).density ?? "legacy",
      });
      return Story();
    },
  ],
};

export default preview;
