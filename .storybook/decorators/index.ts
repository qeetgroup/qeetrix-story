import { addons } from "storybook/preview-api";

import { applyDensity, densityGlobalType, withDensity } from "./density.decorator";
import { applyDirection, directionGlobalType, withDirection } from "./rtl.decorator";
import { applyTheme, themeGlobalType, withTheme } from "./theme.decorator";
import { viewportParameters } from "./viewport.decorator";

export { applyDensity, densityGlobalType, withDensity } from "./density.decorator";
export type { Direction } from "./rtl.decorator";
export { applyDirection, directionGlobalType, toDirection, withDirection } from "./rtl.decorator";
export { applyTheme, themeGlobalType, withTheme } from "./theme.decorator";
export { QEETRIX_VIEWPORTS, viewportParameters } from "./viewport.decorator";

/** The document-level globals this workshop drives from the toolbar. */
export interface QeetrixGlobals {
  theme?: string;
  density?: string;
  direction?: string;
}

/**
 * Every document-level global in one call.
 *
 * Viewport is absent on purpose — Storybook core owns the iframe sizing and there is
 * nothing for us to apply (see viewport.decorator.tsx).
 */
export const applyGlobals = (globals?: QeetrixGlobals) => {
  applyTheme(globals?.theme);
  applyDensity(globals?.density);
  applyDirection(globals?.direction);
};

/**
 * A decorator alone only runs when a *story* renders, which leaves pure-MDX pages
 * (e.g. Foundations → Introduction, which has live components but no story exports)
 * stuck on the initial theme. So we also apply the globals straight from the preview
 * channel: `setGlobals` on first load and `globalsUpdated` on every toolbar change.
 * That covers canvas, autodocs, and MDX uniformly — they all share this one iframe,
 * whose `:root`/`.dark` variables come from @qeetrix/ui/styles.css.
 *
 * The decorators below are still required, and are not redundant with this: they run
 * during render rather than after an event round-trip, which is what stops a story
 * painting one frame in the previous theme, and `withDirection` additionally supplies
 * a React context that no DOM attribute can.
 */
export const syncGlobalsFromChannel = () => {
  try {
    const channel = addons.getChannel();
    channel.on("setGlobals", ({ globals }: { globals?: QeetrixGlobals }) => applyGlobals(globals));
    channel.on("globalsUpdated", ({ globals }: { globals?: QeetrixGlobals }) =>
      applyGlobals(globals),
    );
  } catch {
    // Channel not ready (or unavailable in this context); the decorators still
    // sync on story renders.
  }
};

/** Spread into `preview.globalTypes`. */
export const globalTypes = {
  theme: themeGlobalType,
  density: densityGlobalType,
  direction: directionGlobalType,
};

/**
 * Spread into `preview.decorators`. Order is inside-out: Storybook wraps with the
 * first entry closest to the story, so `withDirection` — the only one that renders an
 * element — ends up outermost.
 */
export const decorators = [withTheme, withDensity, withDirection];

/** Spread into `preview.parameters`. */
export const parameters = { viewport: viewportParameters };
