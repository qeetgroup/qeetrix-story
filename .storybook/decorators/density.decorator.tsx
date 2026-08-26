import type { Decorator } from "@storybook/react-vite";

/**
 * Drives the `data-qx-density` attribute on <html>, which is how @qeetrix/ui
 * rescales control heights, paddings and gaps.
 *
 * `legacy` is the absence of the attribute, not a value: the legacy sizings are the
 * unqualified defaults in the stylesheet, so the attribute is removed rather than
 * set to `"legacy"` — writing it would match no selector and silently do nothing.
 */
export const applyDensity = (density?: string) => {
  if (typeof document === "undefined") return;
  if (density === "comfortable" || density === "compact") {
    document.documentElement.setAttribute("data-qx-density", density);
  } else {
    document.documentElement.removeAttribute("data-qx-density");
  }
};

/** `globalTypes.density` — the Density toolbar control. */
export const densityGlobalType = {
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
};

/** First-paint sync for story renders (see `syncGlobalsFromChannel` for MDX pages). */
export const withDensity: Decorator = (Story, ctx) => {
  applyDensity((ctx.globals as { density?: string }).density ?? "legacy");
  return Story();
};
