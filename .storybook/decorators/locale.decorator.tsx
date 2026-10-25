import { QeetrixProvider } from "@qeetrix/react";
import { hi } from "@qeetrix/react/locales/hi";
import type { Decorator } from "@storybook/react-vite";
import { effectiveGlobals } from "./inherit";

/** The locales @qeetrix/react ships strings for: English (India), and Hindi, its first locale. */
export type Locale = "en-IN" | "hi-IN";

export const toLocale = (value?: string): Locale => (value === "hi-IN" ? "hi-IN" : "en-IN");

/** `<html lang>`, so screen readers and the Devanagari font fallbacks pick the right language. */
export const applyLocale = (locale?: string) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = toLocale(locale).slice(0, 2);
};

/** `globalTypes.locale` — the Language toolbar control. */
export const localeGlobalType = {
  description: "Language: the components' own strings and number and date formats",
  defaultValue: "en-IN",
  toolbar: {
    title: "Language",
    icon: "globe",
    items: [
      { value: "en-IN", title: "English (India)", right: "en-IN" },
      { value: "hi-IN", title: "हिन्दी", right: "hi-IN" },
    ],
    dynamicTitle: true,
  },
};

/**
 * Wraps every story in `QeetrixProvider` with the locale and, for Hindi, the `hi` pack:
 * what a product does at its root. A story's own provider nests inside and wins.
 */
export const withLocale: Decorator = (Story, ctx) => {
  const locale = toLocale(effectiveGlobals(ctx.globals).locale);
  applyLocale(locale);
  return (
    <QeetrixProvider locale={locale} {...(locale === "hi-IN" ? { messages: hi } : {})}>
      {Story()}
    </QeetrixProvider>
  );
};
