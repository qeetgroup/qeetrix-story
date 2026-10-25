import { addons } from "storybook/preview-api";

import { applyDensity, densityGlobalType, withDensity } from "./density.decorator";
import { GLOBALS_EVENT, hostFrame, publishGlobals, type QeetrixGlobals } from "./inherit";
import { applyLocale, localeGlobalType, withLocale } from "./locale.decorator";
import { applyDirection, directionGlobalType, withDirection } from "./rtl.decorator";
import { applyTheme, themeGlobalType, withTheme } from "./theme.decorator";
import { viewportParameters } from "./viewport.decorator";

export { applyDensity, densityGlobalType, withDensity } from "./density.decorator";
/** The document-level globals this workshop drives from the toolbar. */
export type { QeetrixGlobals } from "./inherit";
export type { Locale } from "./locale.decorator";
export { applyLocale, localeGlobalType, toLocale, withLocale } from "./locale.decorator";
export type { Direction } from "./rtl.decorator";
export { applyDirection, directionGlobalType, toDirection, withDirection } from "./rtl.decorator";
export { applyTheme, themeGlobalType, withTheme } from "./theme.decorator";
export { QEETRIX_VIEWPORTS, viewportParameters } from "./viewport.decorator";

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
  applyLocale(globals?.locale);
  publishGlobals(globals ?? {});
};

/**
 * A decorator alone only runs when a *story* renders, which leaves pure-MDX pages
 * (e.g. Foundations → Introduction, which has live components but no story exports)
 * stuck on the initial theme. So we also apply the globals straight from the preview
 * channel: `setGlobals` on first load and `globalsUpdated` on every toolbar change.
 * That covers canvas, autodocs, and MDX uniformly — they all share this one iframe,
 * whose colours @qeetrix/tokens scopes to `data-qx-color-scheme`.
 *
 * The decorators below are still required, and are not redundant with this: they run
 * during render rather than after an event round-trip, which is what stops a story
 * painting one frame in the previous theme, and `withDirection` additionally supplies
 * a React context that no DOM attribute can.
 */
interface PreviewHandle {
  storeInitializationPromise?: Promise<unknown>;
  storyStoreValue?: { userGlobals?: { get?: () => QeetrixGlobals } };
}

/** This frame's Storybook preview (Storybook's own global, read-only here). */
const preview = () =>
  (window as unknown as { __STORYBOOK_PREVIEW__?: PreviewHandle }).__STORYBOOK_PREVIEW__;

/** The globals this frame's preview store holds: the manager's, whoever sent the last event. */
const previewGlobals = (): QeetrixGlobals | undefined =>
  preview()?.storyStoreValue?.userGlobals?.get?.();

export const syncGlobalsFromChannel = () => {
  // A full-screen story frame on a docs page hears no toolbar: it follows the page around it.
  const host = hostFrame();
  if (host) {
    const follow = () => applyGlobals(host.__qeetrixGlobals);
    follow();
    host.addEventListener(GLOBALS_EVENT, follow);
    return;
  }
  try {
    const channel = addons.getChannel();
    // Story frames nested in a docs page announce their own default globals on this channel as
    // they boot, so an event's payload can't be trusted to be this frame's. Any event is only a
    // cue: apply what this frame's own preview store holds (the event's globals as a fallback).
    const sync = ({ globals }: { globals?: QeetrixGlobals }) =>
      applyGlobals(previewGlobals() ?? globals);
    channel.on("setGlobals", sync);
    channel.on("globalsUpdated", sync);
    preview()?.storeInitializationPromise?.then(() => sync({}));
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
  locale: localeGlobalType,
};

/**
 * Spread into `preview.decorators`. Order is inside-out: Storybook wraps with the
 * first entry closest to the story, so `withDirection` — the only one that renders an
 * element — ends up outermost.
 */
export const decorators = [withTheme, withDensity, withLocale, withDirection];

/** Spread into `preview.parameters`. */
export const parameters = { viewport: viewportParameters };
