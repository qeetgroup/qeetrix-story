import { create } from "storybook/theming";

/**
 * Branded Storybook themes for the workshop *chrome* (sidebar / toolbars, via
 * manager.ts) and the autodocs pages (preview.tsx `docs.theme`).
 *
 * Values are the @qeetrix/tokens light-scheme semantics, converted to hex because
 * Storybook's theming API can't read oklch() or CSS variables: Qeet Sans, the
 * Ember accent (`bg.brand-bold`), warm graphite surfaces and text, and the design
 * language's square 4px corners. Keeping them in one place means the workshop reads
 * as one product, not stock Storybook.
 */

const brand = {
  brandTitle: "Qeetrix",
  brandUrl: "https://qeet.in",
  brandTarget: "_self",

  // Ember: `bg.brand-bold` and its hover.
  colorPrimary: "#D04800",
  colorSecondary: "#D04800",

  fontBase: '"Qeet Sans", ui-sans-serif, system-ui, sans-serif',
  fontCode: '"Fira Code", ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',

  barSelectedColor: "#D04800",
  barHoverColor: "#B73D10",
} as const;

/** Light chrome: `surface.canvas`, `surface.default`, `text.default`, `text.subtle`, `border.default`. */
export const qeetrixThemeLight = create({
  ...brand,
  base: "light",
  brandImage: "/qeet-logo.svg",

  appBg: "#FBFAF9",
  appContentBg: "#FFFFFF",
  appPreviewBg: "#FFFFFF",
  appBorderColor: "#E3E1E0",
  appBorderRadius: 4,

  textColor: "#0E0D0D",
  textMutedColor: "#484747",
  textInverseColor: "#FFFFFF",

  barBg: "#FFFFFF",
  barTextColor: "#484747",

  inputBg: "#FFFFFF",
  inputBorder: "#E3E1E0",
  inputTextColor: "#0E0D0D",
  inputBorderRadius: 4,
});

/**
 * Dark docs chrome: the dark-scheme `surface.canvas`, `surface.default`, `surface.raised`,
 * `text.default`, `text.subtle`, `border.default`, and Ember's dark text tone for what's
 * active. blocks/docs-container.tsx switches the docs pages to it with the Theme toolbar, so
 * Storybook's own widgets (controls, type labels, the table of contents) follow the canvas.
 */
export const qeetrixThemeDark = create({
  ...brand,
  base: "dark",
  brandImage: "/qeet-logo-dark.svg",

  colorSecondary: "#F26D0E",
  barSelectedColor: "#F26D0E",
  barHoverColor: "#F26D0E",

  appBg: "#0E0D0D",
  appContentBg: "#131312",
  appPreviewBg: "#131312",
  appBorderColor: "#262625",
  appBorderRadius: 4,

  textColor: "#F3F1EF",
  textMutedColor: "#D1CFCE",
  textInverseColor: "#0E0D0D",

  barBg: "#131312",
  barTextColor: "#D1CFCE",

  inputBg: "#191818",
  inputBorder: "#262625",
  inputTextColor: "#F3F1EF",
  inputBorderRadius: 4,
});

/**
 * Default export used where a single static theme is expected (preview.ts
 * `docs.theme`, and the manager's boot theme in manager.ts). Autodocs typography is
 * driven by the DS tokens in styles.css, so this light base is only a fallback for
 * chrome the CSS doesn't reach.
 *
 * NB: Storybook applies the manager theme *once* at boot — `addons.setConfig({ theme })`
 * does not hot-swap a mounted manager — so the sidebar/toolbar can't follow the Theme
 * toggle by swapping theme objects. manager.ts instead toggles a `.qx-chrome-dark`
 * class on the manager document, and manager-head.html restyles the chrome under it.
 */
export const qeetrixTheme = qeetrixThemeLight;
