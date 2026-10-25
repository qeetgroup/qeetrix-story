import type { Decorator } from "@storybook/react-vite";
import { effectiveGlobals } from "./inherit";

/**
 * Drives the `data-qx-density` attribute on <html>, which is how @qeetrix/tokens
 * rescales control heights, row heights and form gaps (`size.control.*`,
 * `size.row`, `space.form-gap`). Always written, so a story never inherits the
 * previous selection; AppShell sets `compact` on itself, as consoles are dense.
 */
export const applyDensity = (density?: string) => {
  if (typeof document === "undefined") return;
  const value = density === "comfortable" || density === "compact" ? density : "default";
  document.documentElement.setAttribute("data-qx-density", value);
};

/** `globalTypes.density` — the Density toolbar control. */
export const densityGlobalType = {
  description: "Compact / default / comfortable",
  defaultValue: "default",
  toolbar: {
    title: "Density",
    icon: "component",
    items: [
      { value: "compact", title: "Compact" },
      { value: "default", title: "Default" },
      { value: "comfortable", title: "Comfortable" },
    ],
    dynamicTitle: true,
  },
};

/** First-paint sync for story renders (see `syncGlobalsFromChannel` for MDX pages). */
export const withDensity: Decorator = (Story, ctx) => {
  applyDensity(effectiveGlobals(ctx.globals).density ?? "default");
  return Story();
};
