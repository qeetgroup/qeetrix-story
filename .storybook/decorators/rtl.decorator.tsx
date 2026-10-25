import { QeetrixProvider } from "@qeetrix/react";
import type { Decorator } from "@storybook/react-vite";
import { effectiveGlobals } from "./inherit";

/** Reading direction, mirroring the `Direction` type in @qeetrix/react. */
export type Direction = "ltr" | "rtl";

/** Narrows an arbitrary global value to a direction, defaulting to `ltr`. */
export const toDirection = (value?: string): Direction => (value === "rtl" ? "rtl" : "ltr");

/**
 * Mirrors the *document* — `<html dir>` — which is how a real Qeet app declares
 * direction, and the only lever available to pure-MDX pages that render no story.
 *
 * `dir` is always written, never removed, so an explicit `ltr` stops CSS logical
 * properties inheriting a stale `rtl` from a previous toolbar selection in the same
 * iframe.
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
 * Wraps every story in `QeetrixProvider` with the direction as well as flipping
 * `<html dir>`. Both are needed: the provider is what components read for arrow
 * keys, submenus, sliders and drawers (it renders no element, so it can't disturb a
 * story's layout), and the document attribute is what CSS logical properties resolve
 * against, and what carries MDX pages. A story's own provider nests inside this one
 * and wins.
 */
export const withDirection: Decorator = (Story, ctx) => {
  const direction = toDirection(effectiveGlobals(ctx.globals).direction);
  applyDirection(direction);
  return <QeetrixProvider direction={direction}>{Story()}</QeetrixProvider>;
};
