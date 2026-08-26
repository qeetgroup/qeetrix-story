import { DirectionProvider } from "@qeetrix/ui";
import type { Decorator } from "@storybook/react-vite";

/** Reading direction, mirroring the `Direction` contract in @qeetrix/ui. */
export type Direction = "ltr" | "rtl";

/** Narrows an arbitrary global value to a direction, defaulting to `ltr`. */
export const toDirection = (value?: string): Direction => (value === "rtl" ? "rtl" : "ltr");

/**
 * Mirrors the *document* — `<html dir>` — which is how a real Qeet app declares
 * direction, and the only lever available to pure-MDX pages that render no story.
 *
 * `dir` is always written, never removed: `directionFromDom` in @qeetrix/ui resolves
 * via `closest("[dir]")`, so an explicit `ltr` is what stops a component inheriting a
 * stale `rtl` from a previous toolbar selection in the same iframe.
 */
export const applyDirection = (direction?: string) => {
  if (typeof document === "undefined") return;
  document.documentElement.dir = toDirection(direction);
};

/** `globalTypes.direction` — the Direction toolbar control. */
export const directionGlobalType = {
  description: "Reading direction — left-to-right / right-to-left",
  defaultValue: "ltr",
  toolbar: {
    title: "Direction",
    icon: "mirror",
    items: [
      { value: "ltr", title: "LTR" },
      { value: "rtl", title: "RTL" },
    ],
    dynamicTitle: true,
  },
};

/**
 * Wraps every story in @qeetrix/ui's own `DirectionProvider` rather than relying on
 * the `<html dir>` flip alone.
 *
 * Both are needed, for different reasons. Components resolve direction from the DOM
 * only *once per mount*, so flipping the toolbar would not reach an already-mounted
 * story — the provider is the reactive path, and it is also the only one that supplies
 * a direction during render, before first paint. The document attribute is what makes
 * CSS logical properties and Tailwind `rtl:` variants resolve at the root, and what
 * carries MDX pages.
 *
 * The provider renders a `display: contents` wrapper, so it adds no box and cannot
 * disturb a story's layout or its visual-regression snapshot. Stories that declare
 * their own direction (Primitives → DirectionProvider) nest inside this one and win,
 * because a nested provider outranks an ancestor.
 */
export const withDirection: Decorator = (Story, ctx) => {
  const direction = toDirection((ctx.globals as { direction?: string }).direction);
  applyDirection(direction);
  return <DirectionProvider direction={direction}>{Story()}</DirectionProvider>;
};
