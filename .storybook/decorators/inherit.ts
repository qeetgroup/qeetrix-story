/**
 * Globals for full-screen stories on a docs page.
 *
 * A docs page renders a story with `docs.story.inline: false` (every Pattern) in an iframe of its
 * own. Storybook starts that frame with the default globals and never sends it a toolbar change,
 * so it would always paint light, default density, left to right. Worse, as it boots it announces
 * those defaults on the channel, and the docs page around it heard them and switched back to light.
 *
 * So the docs page publishes the globals it applied on its window, and a nested story frame reads
 * them from there (same origin) and follows every change.
 */

export interface QeetrixGlobals {
  theme?: string;
  density?: string;
  direction?: string;
  locale?: string;
}

declare global {
  interface Window {
    /** The globals this frame last applied, for the story frames nested in it. */
    __qeetrixGlobals?: QeetrixGlobals;
  }
}

/** The event a frame fires on its window whenever it applies new globals. */
export const GLOBALS_EVENT = "qeetrix:globals";

/** The docs page this frame is nested in, if it is a story frame on one. */
export function hostFrame(): Window | undefined {
  try {
    return window.parent !== window && window.parent.__qeetrixGlobals ? window.parent : undefined;
  } catch {
    // A cross-origin parent (a page embedding the workshop): not ours to follow.
    return undefined;
  }
}

/** The globals a story should use: its host page's when it has one, else its own. */
export function effectiveGlobals(own: QeetrixGlobals | undefined): QeetrixGlobals {
  return hostFrame()?.__qeetrixGlobals ?? own ?? {};
}

/** Records the globals this frame applied and tells nested story frames. */
export function publishGlobals(globals: QeetrixGlobals): void {
  window.__qeetrixGlobals = globals;
  window.dispatchEvent(new Event(GLOBALS_EVENT));
}
