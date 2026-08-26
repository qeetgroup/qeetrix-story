import type { ViewportMap } from "storybook/viewport";

/**
 * Canonical Qeetrix viewports.
 *
 * Deliberately *not* a decorator, despite the filename it shares with its siblings.
 * Viewport is built into Storybook 10 core (`features.viewport`, on by default): the
 * toolbar, the global (`viewport: { value, isRotated }`) and the iframe resizing are
 * all provided, and the supported extension point is `parameters.viewport.options`.
 * Hand-rolling a resizing decorator would fight the built-in tool for control of the
 * same iframe, so we configure it instead.
 *
 * Supplying `options` *replaces* Storybook's stock device list (INITIAL_VIEWPORTS —
 * 28 entries, iPhone 5 through Pixel XL) rather than extending it. That is the point:
 * four fixed breakpoints, matching the @qeetrix/ui Tailwind breakpoints, so teams stop
 * inventing their own and two reviewers checking "does this work on tablet?" are
 * looking at the same 768px.
 *
 * Heights are the conventional portrait companions to each width and only matter for
 * the visible frame; components are authored against the width.
 *
 * No default is set, so the canvas opens at Storybook's `responsive` value and fills
 * the preview area exactly as it did before — selecting a preset is opt-in, per story
 * (`parameters.viewport.value`) or from the toolbar.
 */
export const QEETRIX_VIEWPORTS = {
  mobile: { name: "Mobile", styles: { width: "390px", height: "844px" }, type: "mobile" },
  tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  desktop: { name: "Desktop", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  wide: { name: "Wide", styles: { width: "1920px", height: "1080px" }, type: "desktop" },
} as const satisfies ViewportMap;

/** Spread into `preview.parameters.viewport`. */
export const viewportParameters = { options: QEETRIX_VIEWPORTS };
