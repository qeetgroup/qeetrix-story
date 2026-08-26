import type { Decorator } from "@storybook/react-vite";

/**
 * Drives light/dark via the `.dark` class on <html> — the same class strategy
 * the Qeetrix ThemeProvider uses in production, so stories look identical to apps.
 *
 * The class lands on the document element rather than a wrapper because that is
 * where `:root`/`.dark` custom properties from @qeetrix/ui/styles.css are defined;
 * scoping it lower would leave half the tokens resolving against the light values.
 */
export const applyTheme = (theme?: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
};

/** `globalTypes.theme` — the Theme toolbar control. */
export const themeGlobalType = {
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
};

/** First-paint sync for story renders (see `syncGlobalsFromChannel` for MDX pages). */
export const withTheme: Decorator = (Story, ctx) => {
  applyTheme((ctx.globals as { theme?: string }).theme ?? "light");
  return Story();
};
