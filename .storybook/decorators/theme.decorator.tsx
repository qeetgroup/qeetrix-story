import type { Decorator } from "@storybook/react-vite";
import { effectiveGlobals } from "./inherit";

/**
 * Drives light/dark through `data-qx-color-scheme` on <html>, the attribute
 * QeetrixProvider sets in production and that @qeetrix/tokens scopes its colours
 * to, so stories look identical to apps.
 *
 * It lands on the document element rather than a wrapper because portalled
 * overlays (menus, dialogs, toasts) render at the end of <body> and must resolve
 * the same tokens as the story.
 */
export const applyTheme = (theme?: string) => {
  if (typeof document !== "undefined") {
    const scheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-qx-color-scheme", scheme);
    document.documentElement.style.colorScheme = scheme;
  }
};

/** `globalTypes.theme` — the Theme toolbar control. */
export const themeGlobalType = {
  description: "Colour scheme: light / dark",
  defaultValue: "light",
  toolbar: {
    title: "Theme",
    icon: "circlehollow",
    items: [
      { value: "light", title: "Light", icon: "sun" },
      { value: "dark", title: "Dark", icon: "moon" },
    ],
    dynamicTitle: true,
  },
};

/** First-paint sync for story renders (see `syncGlobalsFromChannel` for MDX pages). */
export const withTheme: Decorator = (Story, ctx) => {
  applyTheme(effectiveGlobals(ctx.globals).theme ?? "light");
  return Story();
};
